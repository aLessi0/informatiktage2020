import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {MapComponent} from './components/map/map.component';
import {WelcomeComponent} from './components/welcome/welcome.component';
import {RoomComponent} from './components/room/room.component';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {ButtonComponent} from './components/base/button/button.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularMaterialModule} from './components/modal/angular-material.module';
import {QuizfrageComponent} from './components/base/quizfrage/quizfrage.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { AvatarSelectorComponent } from './components/avatar-selector/avatar-selector.component';
import { ImageMapComponent } from './components/image-map/image-map.component';
import {FeedbackComponent} from './components/modal/feedback/feedback.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    RoomComponent,
    QuizfrageComponent,
    ButtonComponent,
    WelcomeComponent,
    AvatarComponent,
    AvatarSelectorComponent,
    ImageMapComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AngularSvgIconModule,
    BrowserAnimationsModule,
    AngularMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [FeedbackComponent] // define modal components
})

export class AppModule {
}
