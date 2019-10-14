import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  @Input() public roomColor: string;

  public ngOnInit() {
    console.log('this roomcolor is: ' + this.roomColor);
  }
}
