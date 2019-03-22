import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ControllerComponent } from './controller/controller.component';
import { KeysPipe } from './keys.pipe';
import { TimePipe } from './time.pipe';
import { ElapsedPipe } from './elapsed.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    ControllerComponent,
    KeysPipe,
    TimePipe,
    ElapsedPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyBaH55xro5s2g2FGzop9HKZB-S_2jPusi8',
      authDomain: 'ananday-queue.firebaseapp.com',
      databaseURL: 'https://ananday-queue.firebaseio.com',
      projectId: 'ananday-queue',
      storageBucket: 'ananday-queue.appspot.com',
      messagingSenderId: '544859891618'
    }),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
