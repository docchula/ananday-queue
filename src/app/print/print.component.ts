import {Component, OnInit} from '@angular/core';
import {Queue} from '../queue';
import {Observable} from 'rxjs';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'and-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {
  $queues: Observable<Queue>;

  constructor(private afd: AngularFireDatabase) {
  }

  ngOnInit() {
    this.$queues = this.afd
      .object<Queue>('queues/0')
      .valueChanges();
  }

}
