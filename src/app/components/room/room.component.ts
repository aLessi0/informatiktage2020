import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  @Input() public roomColor: string;
  @Output() public onClose: EventEmitter<void> = new EventEmitter();

  public ngOnInit() {
    console.log('this roomcolor is: ' + this.roomColor);
  }

}
