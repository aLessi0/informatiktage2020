import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {RoomModel} from '../../model/game/room.model';
import {FeedbackComponent} from '../modal/feedback/feedback.component';
import {ModalService} from '../../service/modal.service';

@Component({
  selector: 'app-room-container',
  templateUrl: './room-container.component.html',
  styleUrls: ['./room-container.component.scss']
})
export class RoomContainerComponent implements OnInit {
  @Input() public room: RoomModel;
  @Output() private closeRoom: EventEmitter<void> = new EventEmitter();

  public optionalQuestions: number[];
  private mandatoryQuestionWasAnsweredOnEntry: boolean;

  constructor(@Inject(ModalService) private readonly modalService: ModalService) {
  }

  public ngOnInit(): void {
    this.optionalQuestions = [];
    for (let i = 1; i < this.room.questions.length; i++) {
      this.optionalQuestions.push(i);
    }

    this.mandatoryQuestionWasAnsweredOnEntry = this.room.questions[0].answered;
  }

  public onStreetMapTap(): void {
    if (!this.room.feedback && !this.mandatoryQuestionWasAnsweredOnEntry && this.room.questions[0].answered) {
      this.modalService.openDialog(FeedbackComponent, true).subscribe(() => this.closeRoom.emit());
    } else {
      this.closeRoom.emit();
    }

  }

}
