import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BoardSetting } from 'app/board-setting';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/operator/switchMap';
import { Queue } from 'app/queue';
import 'rxjs/add/operator/first';
import * as firebase from 'firebase/app';
import 'firebase/database';

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

  constructor(private afd: AngularFireDatabase) { }

  ngOnInit() {
    this.boardSetting = this.board.switchMap((board) => this.afd.object(`boards/${board}`));
    this.queues = this.afd.list('queues');
  };

  next(queue: number | string, personKey: string) {
    let number: number;
    if (typeof queue === 'string') {
      number = parseInt(queue as string, 10);
    } else {
      number = queue;
    }
    this.afd.object(`queues/${number}/queue/${personKey}`).first().subscribe((person) => {
      const newKey = this.afd.database.ref(`queues/${number + 1}/queue`).push(person).key;
      this.afd.database.ref(`queues/${number + 1}/queue/${newKey}/keyStack`).push(personKey);
      this.afd.database.ref(`queues/${number + 1}/queue/${newKey}/timeStack`).push(firebase.database.ServerValue.TIMESTAMP);
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
    this.afd.object(`queues/${number}/queue/${personKey}`).first().subscribe((person) => {
      this.afd.list(`queues/${number}/queue/${personKey}/keyStack`).first().subscribe((keyStack: any[]) => {
        const last = keyStack[keyStack.length - 1];
        const lastKey = last.$key;
        const lastValue = last.$value;
        this.afd.database.ref(`queues/${number - 1}/queue/${lastValue}`).set(person);
        this.afd.database.ref(`queues/${number}/queue/${personKey}`).remove();
        this.afd.database.ref(`queues/${number - 1}/queue/${lastValue}/keyStack/${lastKey}`).remove();
        this.afd.list(`queues/${number - 1}/queue/${lastValue}/timeStack`).first().subscribe((timeStack: any[]) => {
          const lastTimeKey = timeStack[timeStack.length - 1].$key;
          this.afd.database.ref(`queues/${number - 1}/queue/${lastValue}/timeStack/${lastTimeKey}`).remove();
        });
      });
    });
  }

}
