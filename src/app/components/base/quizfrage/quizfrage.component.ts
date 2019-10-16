import {Component, Inject} from '@angular/core';
import {DataService} from '../../../service/data.service';
import {QuestionModel} from '../../../model/game/question.model';
import {RoomModel} from '../../../model/game/room.model';
import {MAT_DIALOG_DATA} from '@angular/material';
import {ProgressModel} from '../../../model/user/progress.model';
import {ProgressService} from '../../../service/progress.service';
import {AnswerModel} from '../../../model/user/answer.model';
import {PlayedLevelModel} from '../../../model/user/played-level.model';
import {ModalService} from '../../../service/modal.service';

@Component({
  selector: 'app-quizfrage',
  templateUrl: './quizfrage.component.html',
  styleUrls: ['./quizfrage.component.scss']
})
export class QuizfrageComponent {
  private question: QuestionModel;
  private room: RoomModel;
  private progress: ProgressModel;
  private answer: AnswerModel;
  private level: PlayedLevelModel;
  private answerGiven: string;

  constructor(@Inject(DataService) private readonly dataService: DataService,
              @Inject(ProgressService) private readonly progressService: ProgressService,
              @Inject(MAT_DIALOG_DATA) public data: QuizfrageData,
              @Inject(ModalService) private readonly modalService: ModalService) {
    this.dataService.activeRoom$.subscribe(room => this.room = room);
    this.progressService.progress$.subscribe(progress => {
      this.question = this.data.question;
      this.progress = progress;
      this.level = this.progress.playedLevels.get(this.room.level);
      if (this.level.answers.has(this.question.number)) {
        this.answer = this.level.answers.get(this.question.number);
        this.answerGiven = this.answer.answer;

      }
    });
  }

  public validateAnswer(): void {
    const answerIsCorrect = this.answerGiven && this.question.correctAnswer.toLowerCase() === this.answerGiven.toLowerCase();
    const firstTime: boolean = !this.answer;

    if (firstTime) {
      const answer = new AnswerModel();
      answer.correct = answerIsCorrect;
      answer.number = this.question.number;
      answer.answer = this.answerGiven;
      this.level.answers.set(answer.number, answer);
      this.answer = answer;
    }

    this.answer.correct = answerIsCorrect;
    this.answer.answer = this.answerGiven;

    if (this.question.isMandatory) {
      if (!this.answer.wasCorrectOnce && answerIsCorrect) {
        this.level.key = true;
        this.answer.wasCorrectOnce = true;
        this.progressService.updateProgress(this.progress);
        this.progressService.unlockLevel(this.level.level + 1);
      }
    } else {
      if (!this.answer.wasCorrectOnce && answerIsCorrect) {
        this.progress.coins++;
        this.level.coins++;
        this.answer.wasCorrectOnce = true;
      }
    }

    this.progressService.updateProgress(this.progress);
  }

  public closeQuestion(): void {
    this.modalService.closeDialog();
  }
}

export class QuizfrageData {
  question: QuestionModel;
}
