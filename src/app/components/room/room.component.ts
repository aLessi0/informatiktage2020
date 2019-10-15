import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {RoomModel} from '../../model/game/room.model';
import {QuestionModel} from '../../model/game/question.model';
import {DataService} from '../../service/data.service';
import {ModalService} from '../../service/modal.service';
import {QuizfrageComponent} from '../base/quizfrage/quizfrage.component';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent {
  @Input() public room: RoomModel;
  @Output() private onClose: EventEmitter<void> = new EventEmitter();

  constructor(@Inject(DataService) private readonly dataService: DataService,
              @Inject(ModalService) private readonly modalService: ModalService) {

  }

  public closeRoom(): void {
    if (!this.room.feedback) {
      //  no feedback yet, intercept with feedback screen
    }
    this.onClose.emit();
  }

  public openQuestion(question: QuestionModel): void {
    this.dataService.selectQuestion(question);
    this.modalService.openDialog(QuizfrageComponent, false);
  }

}
