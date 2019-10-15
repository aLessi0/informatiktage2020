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
import {AvatarComponent} from './components/avatar/avatar.component';
import {AvatarSelectorComponent} from './components/avatar-selector/avatar-selector.component';
import {ImageMapComponent} from './components/image-map/image-map.component';
import {FeedbackComponent} from './components/modal/feedback/feedback.component';
import {InfotextComponent} from './components/base/infotext/infotext.component';
import { WeltDerInformatikComponent } from './components/room/1-welt-der-informatik/welt-der-informatik.component';
import { RequirementDesignComponent } from './components/room/2-requirement-design/requirement-design.component';
import { EntwicklungComponent } from './components/room/3-entwicklung/entwicklung.component';
import { BuildDeployComponent } from './components/room/4-build-deploy/build-deploy.component';
import { RecruitingComponent } from './components/room/5-recruiting/recruiting.component';
import { PlaygroundComponent } from './components/room/6-playground/playground.component';

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
    ImageMapComponent,
    InfotextComponent,
    WeltDerInformatikComponent,
    RequirementDesignComponent,
    EntwicklungComponent,
    BuildDeployComponent,
    RecruitingComponent,
    PlaygroundComponent
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
  entryComponents: [
    FeedbackComponent,
    InfotextComponent,
    QuizfrageComponent
  ] // define modal components
})

export class AppModule {
}
