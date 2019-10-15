import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {RoomModel} from '../../model/game/room.model';
import {FeedbackComponent} from '../modal/feedback/feedback.component';
import {DataService} from '../../service/data.service';
import {ModalService} from '../../service/modal.service';
import {QuestionModel} from '../../model/game/question.model';
import {QuizfrageComponent} from '../base/quizfrage/quizfrage.component';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  @Input() public room: RoomModel;
  @Output() private onClose: EventEmitter<void> = new EventEmitter();

  public optionalQuestions: number[];

  constructor(@Inject(DataService) private readonly dataService: DataService,
              @Inject(ModalService) private readonly modalService: ModalService) {
  }

  public ngOnInit(): void {
    this.optionalQuestions = [];
    for (let i = 1; i < this.room.questions.length; i++) {
      this.optionalQuestions.push(i);
    }
  }

  public closeRoom(): void {
    if (!this.room.feedback) {
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
