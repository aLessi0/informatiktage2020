import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {QuizRoomComponent} from './components/quiz-room/quiz-room.component';
import {MapComponent} from './components/map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    QuizRoomComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
