import {Component, OnInit} from '@angular/core';
import {UntypedFormGroup, UntypedFormControl, Validators} from '@angular/forms';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import firebase from 'firebase/compat/app';
import {Queue} from '../queue';
import {Observable} from 'rxjs';
import {KeyValue} from '@angular/common';

@Component({
  selector: 'and-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: UntypedFormGroup;
  $queues: Observable<Queue>;
  reserved: Queue['queue'][0];
  reservedIndex: number

  constructor(private afd: AngularFireDatabase) {
  }

  ngOnInit() {
    this.registerForm = new UntypedFormGroup({
      name: new UntypedFormControl('', Validators.required),
      read: new UntypedFormControl(''),
      table: new UntypedFormControl('', Validators.required),
      wreath: new UntypedFormControl('', Validators.required),
      tel: new UntypedFormControl(''),
      email: new UntypedFormControl(''),
      remarks: new UntypedFormControl('')
    });
    this.$queues = this.afd
      .object<Queue>('queues/-1')
      .valueChanges();
  }

  showRegister(item: Queue['queue'][0], index: number) {
    this.reserved = item;
    this.reservedIndex = index;
    this.registerForm.patchValue(item.value);
  }

  submit() {
    if (this.registerForm.valid) {
      // Push on to first queue
      const newKey = this.afd.database
        .ref(`queues/0/queue`)
        .push().key;
      const ref = this.afd.database
        .ref(`queues/0/queue/${newKey}`);
      ref.set({
        value: this.registerForm.value,
        registerTime: firebase.database.ServerValue.TIMESTAMP,
        keyStack: {[newKey]: this.reservedIndex}
      });
      ref
        .child('timeStack')
        .push(firebase.database.ServerValue.TIMESTAMP)
        .then(data => {
          this.registerForm.reset();
        });

      // Remove from queue -1
      this.afd.database.ref(`queues/-1/queue/${this.reservedIndex}`).remove();

      this.reserved = null;
    }
  }
}
