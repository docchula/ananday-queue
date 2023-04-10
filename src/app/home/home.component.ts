import { switchMap, map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'and-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loginForm: UntypedFormGroup;
  currentUser: Observable<firebase.User>;
  userRole: Observable<string>;
  userBoard: Observable<string>;
  isNotLoggedIn: Observable<boolean>

  constructor(private afa: AngularFireAuth, private afd: AngularFireDatabase) {}

  ngOnInit() {
    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      password: new UntypedFormControl('', Validators.required)
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
    this.isNotLoggedIn = this.currentUser.pipe(map(v => !v));
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
      this.afa.signInWithEmailAndPassword(
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
    this.afa.signOut();
  }
}
