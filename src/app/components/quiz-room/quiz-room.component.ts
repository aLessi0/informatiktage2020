import {Component, Inject} from '@angular/core';
import {DataService} from '../../service/data.service';
import {RoomModel} from '../../model/game/room.model';
import {QuestionModel} from '../../model/game/question.model';

@Component({
  selector: 'app-quiz-room',
  templateUrl: './quiz-room.component.html',
  styleUrls: ['./quiz-room.component.scss']
})
export class QuizRoomComponent {
  public activeRoom: RoomModel;

  constructor(@Inject(DataService) private readonly dataService: DataService) {
    this.dataService.activeRoom$.subscribe((activeRoom) => {
      this.activeRoom = activeRoom;
      if (this.activeRoom) {
        console.log(this.activeRoom);
      }
    });
  }

  public checkAnswer(question: QuestionModel): void {
    if (question.number === 1) {
      this.dataService.answeredMandatoryQuestion(this.activeRoom, question);
    } else {
      this.dataService.answeredOptionQuestion(this.activeRoom, question);
    }
    console.log(question);
  }
}


