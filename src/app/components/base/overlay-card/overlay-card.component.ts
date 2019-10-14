import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-overlay-card',
  templateUrl: './overlay-card.component.html',
  styleUrls: ['./overlay-card.component.scss']
})
export class OverlayCardComponent implements OnInit {

  @Input()
  title: string;

  constructor() { }

  ngOnInit() {
  }

}
