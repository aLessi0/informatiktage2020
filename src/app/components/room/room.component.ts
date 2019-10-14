import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RoomModel} from '../../model/game/room.model';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  @Input() public room: RoomModel;
  @Output() private onClose: EventEmitter<void> = new EventEmitter();

  public ngOnInit() {
  }

  public closeRoom(): void {
    if (!this.room.feedback) {
      //  no feedback yet, intercept with feedback screen
    }
    this.onClose.emit();
  }

}
