import { switchMap, map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';

@Component({
  selector: 'and-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loginForm: FormGroup;
  currentUser: Observable<firebase.User>;
  userRole: Observable<string>;
  userBoard: Observable<string>;

  constructor(private afa: AngularFireAuth, private afd: AngularFireDatabase) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
    this.currentUser = this.afa.authState;
    this.userRole = this.currentUser.pipe(
      switchMap((user: firebase.User, index: number) => {
        if (user) {
          return this.afd
            .object<string>(`users/${user.uid}/role`)
            .snapshotChanges()
            .pipe(
              map(snap => {
                return {
                  $key: snap.key,
                  $value: snap.payload.val()
                };
              }),
              map(v => v.$value)
            );
        } else {
          return ['none'];
        }
      })
    );
    this.userBoard = this.currentUser.pipe(
      switchMap((user: firebase.User, index: number) => {
        if (user) {
          return this.afd
            .object<string>(`users/${user.uid}/board`)
            .snapshotChanges()
            .pipe(
              map(snap => {
                return {
                  $key: snap.key,
                  $value: snap.payload.val()
                };
              }),
              map(v => v.$value)
            );
        } else {
          return ['none'];
        }
      })
    );
  }

  login() {
    if (this.loginForm.valid) {
      this.afa.auth
        .signInWithEmailAndPassword(
          this.loginForm.value['email'],
          this.loginForm.value['password']
        )
        .then(
          () => {
            this.loginForm.reset();
          },
          () => {
            alert('Email หรือ Password ไม่ถูกต้อง');
          }
        );
    }
  }

  logOut() {
    this.afa.auth.signOut();
  }
}
