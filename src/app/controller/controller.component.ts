import {first, map, switchMap} from 'rxjs/operators';
import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {BoardSetting} from 'app/board-setting';
import {AngularFireDatabase} from '@angular/fire/database';

import {Queue} from 'app/queue';

import * as firebase from 'firebase/app';
import 'firebase/database';
import {Person} from '../person';

@Component({
  selector: 'and-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss']
})
export class ControllerComponent implements OnInit {
  @Input() board: Observable<string>;
  @Input() role: Observable<string>;

  boardSetting: Observable<BoardSetting>;
  queues: Observable<Queue[]>;
  previousCalledQueues: {
    value: Person,
    codeStack: string[]
  }[];

  constructor(private afd: AngularFireDatabase) {
  }

  ngOnInit() {
    this.boardSetting = this.board.pipe(
      switchMap(board =>
        this.afd.object<BoardSetting>(`boards/${board}`).valueChanges()
      )
    );
    this.queues = this.afd
      .list<Queue>('queues')
      .snapshotChanges()
      .pipe(
        map(snaps => {
          return snaps.map(snap => {
            return {
              $key: snap.key,
              ...snap.payload.val()
            };
          });
        })
      );
    this.board.pipe(first()).subscribe(boardValue => {
      console.log('Initializing speech synthesis.');
      if (boardValue === 'showBoard') {
        this.previousCalledQueues = [];
        this.queues.subscribe(allQueues => {
          const calledQueuesObj = allQueues.find(obj => {
            return obj.name === 'called';
          }).queue;
          if (calledQueuesObj && Object.keys(calledQueuesObj).length >= 1) {
            const calledQueues = Object.keys(calledQueuesObj).map(i => calledQueuesObj[i]);
            const diff = calledQueues.filter(item => this.previousCalledQueues.indexOf(item.registerTime) < 0);
            this.previousCalledQueues = calledQueues.map(q => q.registerTime);
            diff.forEach(info => {
              // @ts-ignore
              responsiveVoice.speak(
                'ขอเชิญ. ' + (info.value.read.replace('-', '') || info.value.name) + '. ที่ด้านหลังค่ะ',
                'Thai Female', {rate: 0.9});
            });
          } else {
            this.previousCalledQueues = [];
          }
        });
      }
    });
  }

  next(queue: number | string, personKey: string) {
    let number: number;
    if (typeof queue === 'string') {
      number = parseInt(queue as string, 10);
    } else {
      number = queue;
    }
    this.afd
      .object<any>(`queues/${number}/queue/${personKey}`)
      .valueChanges()
      .pipe(first())
      .subscribe(person => {
        const newKey = this.afd.database
          .ref(`queues/${number + 1}/queue`)
          .push().key;
        const keyStack = person.keyStack || {} as any;
        keyStack[newKey] = personKey;
        const timeStack = person.timeStack || {} as any;
        timeStack[newKey] = firebase.database.ServerValue.TIMESTAMP;
        this.afd.database.ref(`queues/${number + 1}/queue/${newKey}`).set({
          ...person,
          keyStack,
          timeStack
        });
        this.afd.database.ref(`queues/${number}/queue/${personKey}`).remove();
      });
  }

  back(queue: number | string, personKey: string) {
    let number: number;
    if (typeof queue === 'string') {
      number = parseInt(queue as string, 10);
    } else {
      number = queue;
    }
    this.afd
      .object<any>(`queues/${number}/queue/${personKey}`)
      .valueChanges()
      .pipe(first())
      .subscribe(person => {
        const keyStack = person.keyStack as any;
        const timeStack = person.timeStack as any;
        const keys = Object.keys(keyStack);
        const lastKey = keys[keys.length - 1];
        const lastValue = keyStack[lastKey];
        const {[lastKey]: _, ...newKeyStack} = keyStack;
        const timeKeys = Object.keys(timeStack);
        const lastTimeKey = timeKeys[timeKeys.length - 1];
        const {[lastTimeKey]: __, ...newTimeStack} = timeStack;
        this.afd.database.ref(`queues/${number - 1}/queue/${lastValue}`).set({
          ...person,
          keyStack: newKeyStack,
          timeStack: newTimeStack
        });
        this.afd.database.ref(`queues/${number}/queue/${personKey}`).remove();
      });
  }
}
