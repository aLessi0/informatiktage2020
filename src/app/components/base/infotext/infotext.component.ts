import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-infotext',
  templateUrl: './infotext.component.html',
  styleUrls: ['./infotext.component.scss']
})
export class InfotextComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: InfotextData) {
  }

  ngOnInit() {
  }

}

export interface InfotextData {
  text: string;
}
