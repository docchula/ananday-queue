import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ControllerComponent } from './controller/controller.component';
import { KeysPipe } from './keys.pipe';
import { TimePipe } from './time.pipe';
import { ElapsedPipe } from './elapsed.pipe';
import { ViewWreathComponent } from './view-wreath/view-wreath.component';
import { WreathPositionPipe } from './wreath-position.pipe';
import { PrintComponent } from './print/print.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    ControllerComponent,
    KeysPipe,
    TimePipe,
    ElapsedPipe,
    ViewWreathComponent,
    WreathPositionPipe,
    PrintComponent
  ],
  imports: [
    BrowserModule,
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
