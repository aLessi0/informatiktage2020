import {NgModule} from '@angular/core';
import {MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import {FeedbackComponent} from './feedback/feedback.component';
import {CommonModule} from '@angular/common';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
  imports: [MatDialogModule, MatFormFieldModule, MatButtonModule, MatInputModule, CommonModule, AngularSvgIconModule],
  exports: [MatDialogModule, MatFormFieldModule, MatButtonModule, MatInputModule],
  declarations: [FeedbackComponent]
})

export class AngularMaterialModule {
}
