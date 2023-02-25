import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {QuestionModel} from '../../../model/game/question.model';
import {MAT_DIALOG_DATA} from '@angular/material';
import {ModalService} from '../../../service/modal.service';
import {TypewriterUtils} from '../../../utils/typewriter.utils';

@Component({
  selector: 'app-quizfrage',
  templateUrl: './quizfrage.component.html',
  styleUrls: ['./quizfrage.component.scss']
})
export class QuizfrageComponent implements OnInit {
  public question: QuestionModel;
  public answerGiven: string;
  public answerIsWrong: boolean;
  public textFinished: boolean;
  public buttonTexts: string [] = [];
  public correctAnswer: string;

  @ViewChild('quizfrage') private quizfrageElement: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: QuizfrageData,
              @Inject(ModalService) private readonly modalService: ModalService) {
    this.question = this.data.question;
    this.buttonTexts = this.data.question.correctAnswers;
    console.log(this.data.question.correctAnswers);
    this.correctAnswer = this.data.question.correctAnswer;
  }

  public ngOnInit(): void {
    if (this.question.questionText) {
      TypewriterUtils.typewrite(this.quizfrageElement.nativeElement, this.question.questionText).then(() => {
        setTimeout(() => this.textFinished = true, 500);
      });
    }
  }

  public validateAnswer(answer: string): void {
    if (answer === this.correctAnswer) {
      this.answerIsWrong = false;
      this.data.correctlyAnswered = true;
      this.modalService.closeDialog();
    } else {
      this.answerIsWrong = true;
    }
  }
}

export class QuizfrageData {
  question: QuestionModel;
  icon: string;
  correctlyAnswered: boolean;
}
