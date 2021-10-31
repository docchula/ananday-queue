import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Queue} from '../queue';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Person} from '../person';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'and-view-wreath',
  templateUrl: './view-wreath.component.html',
  styleUrls: ['./view-wreath.component.scss']
})
export class ViewWreathComponent implements OnInit {
  reserveForm: FormGroup;
  reservePos: string;
  $registered: Observable<(Person & {status: number; id: string})[]>;

  constructor(private afd: AngularFireDatabase) {
  }

  ngOnInit() {
    this.reserveForm = new FormGroup({
      name: new FormControl('', Validators.required),
      wreath: new FormControl('', Validators.required),
      remarks: new FormControl('')
    });
    this.$registered = this.afd
      .list<Queue>('queues')
      .snapshotChanges()
      .pipe(
        map(snaps => {
          return snaps.map(snap => {
            return {
              $key: snap.key,
              ...snap.payload.val()
            };
          }).filter(snap => {
            return parseInt(snap.$key, 10) < 2;
          }).reduce((prev, current) => {
            const queue = [];
            for (const prop in current.queue) {
              if ((current.queue as object).hasOwnProperty(prop)) {
                queue.push({...current.queue[prop].value, status: parseInt(current.$key, 10), id: prop});
              }
            }
            return [
              ...prev, ...queue
            ];
          }, []);
        })
      );
  }

  showReserve(position: string) {
    this.reservePos = position;
    this.reserveForm.patchValue({wreath: position});
  }

  deleteReserve(id: string) {
    if (confirm('แน่ใจหรือว่าจะลบ?')) {
      this.afd
        .object<any>(`queues/-1/queue/${id}`)
        .remove();
    }
  }

  submit() {
    if (this.reserveForm.valid) {
      // Push on to first queue
      const ref = this.afd.database
        .ref(`queues/-1/queue`)
        .push({
          value: this.reserveForm.value,
          registerTime: firebase.database.ServerValue.TIMESTAMP
        });
      ref
        .child('timeStack')
        .push(firebase.database.ServerValue.TIMESTAMP)
        .then(data => {
          this.reserveForm.reset();
        });
    }
  }

  arrayOfSequence(n: number): number[] {
    return Array.from(Array(n).keys()).map(num => {
      return ++num;
    });
  }
}
