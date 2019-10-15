import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {RoomModel} from '../../model/game/room.model';
import {QuestionModel} from '../../model/game/question.model';
import {DataService} from '../../service/data.service';
import {ModalService} from '../../service/modal.service';
import {QuizfrageComponent} from '../base/quizfrage/quizfrage.component';
import {FeedbackComponent} from "../modal/feedback/feedback.component";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  @Input() public room: RoomModel;
  @Output() private onClose: EventEmitter<void> = new EventEmitter();

  private mandatoryQuestionWasAnsweredOnEntry: boolean;

  constructor(@Inject(DataService) private readonly dataService: DataService,
              @Inject(ModalService) private readonly modalService: ModalService) {
  }

  public ngOnInit(): void {
    this.mandatoryQuestionWasAnsweredOnEntry = this.room.questions[0].answered;
  }

  public closeRoom(): void {
    if (!this.room.feedback && !this.mandatoryQuestionWasAnsweredOnEntry && this.room.questions[0].answered) {
      this.modalService.openDialog(FeedbackComponent, true).subscribe(() => this.onClose.emit());
    } else {
      this.onClose.emit();
    }

  }

  public openQuestion(question: QuestionModel): void {
    this.dataService.selectQuestion(question);
    this.modalService.openDialog(QuizfrageComponent, false).subscribe(() => {
      this.dataService.unselectQuesion();
    });
  }

}
