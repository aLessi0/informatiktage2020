import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {MapComponent} from './components/map/map.component';
import {WelcomeComponent} from './components/welcome/welcome.component';
import {RoomComponent} from './components/room/room.component';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {ButtonComponent} from './components/base/button/button.component';
import {QuizfrageComponent} from './components/base/quizfrage/quizfrage.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    RoomComponent,
    QuizfrageComponent,
    ButtonComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AngularSvgIconModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})

export class AppModule {
}
