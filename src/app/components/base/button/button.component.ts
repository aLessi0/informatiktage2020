import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input()
  btnTitle: string;

  @Output()
  btnClicked = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  click() {
    this.btnClicked.emit(true);
  }

}
