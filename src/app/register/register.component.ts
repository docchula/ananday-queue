import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase/app';
import 'firebase/database';

@Component({
  selector: 'and-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private afd: AngularFireDatabase) {}

  ngOnInit() {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      read: new FormControl('', Validators.required),
      table: new FormControl('', Validators.required),
      wreath: new FormControl('', Validators.required),
      tel: new FormControl(''),
      email: new FormControl(''),
      remarks: new FormControl('')
    });
  }

  submit() {
    if (this.registerForm.valid) {
      // Push on to first queue
      const ref = this.afd.database
        .ref(`queues/0/queue`)
        .push({
          value: this.registerForm.value,
          registerTime: firebase.database.ServerValue.TIMESTAMP
        });
      ref
        .child('timeStack')
        .push(firebase.database.ServerValue.TIMESTAMP)
        .then(data => {
          this.registerForm.reset();
        });
    }
  }
}
