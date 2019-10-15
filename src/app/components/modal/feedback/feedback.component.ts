import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../service/data.service';
import {ModalService} from '../../../service/modal.service';
import {RoomModel} from '../../../model/game/room.model';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  private room: RoomModel;
  private feedback = 0;

  constructor(private dataService: DataService,
              private modalService: ModalService) {
    this.dataService.activeRoom$.subscribe(room => this.room = room);
  }

  ngOnInit() {
  }

  onFeedbackClick(feedback) {
    // dataservice update feedback for room
    if (this.room) {
      this.room.feedback = feedback;
      this.dataService.roomUpdated();
      this.modalService.closeDialog();
    }
  }

}
