import {Component, Inject} from '@angular/core';
import {DataService} from '../../../service/data.service';
import {QuestionModel} from '../../../model/game/question.model';
import {RoomModel} from '../../../model/game/room.model';

@Component({
  selector: 'app-quizfrage',
  templateUrl: './quizfrage.component.html',
  styleUrls: ['./quizfrage.component.scss']
})
export class QuizfrageComponent {
  private question: QuestionModel;
  private room: RoomModel;

  constructor(@Inject(DataService) private readonly dataService: DataService) {
    this.dataService.activeQuestion$.subscribe(question => this.question = question);
    this.dataService.activeRoom$.subscribe(room => this.room = room);
  }

  public validateAnswer(): void {
    if (this.question.isMandatory) {
      this.dataService.answeredMandatoryQuestion(this.room, this.question);
    } else {
      this.dataService.answeredOptionQuestion(this.room, this.question);
    }
  }
}
