import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RoomModel} from '../../model/game/room.model';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent {
  @Input() public room: RoomModel;
  @Output() private onClose: EventEmitter<void> = new EventEmitter();

  public closeRoom(): void {
    if (!this.room.feedback) {
      //  no feedback yet, intercept with feedback screen
    }
    this.onClose.emit();
  }

}
