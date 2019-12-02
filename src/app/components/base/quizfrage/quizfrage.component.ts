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
  @ViewChild('quizfrage') private quizfrageElement: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: QuizfrageData,
              @Inject(ModalService) private readonly modalService: ModalService) {
    this.question = this.data.question;
  }

  public ngOnInit(): void {
    if (this.question.questionText) {
      TypewriterUtils.typewrite(this.quizfrageElement.nativeElement, this.question.questionText).then(() => {
        setTimeout(() => this.textFinished = true, 500);
      });
    }
  }

  public validateAnswer(): void {
    const answrs = [];
    this.question.correctAnswers.forEach((answer) => {
      answrs.push(answer.toLowerCase());
    });
    this.answerIsWrong = !(this.answerGiven && answrs.indexOf(this.answerGiven.toLowerCase()) > -1);

    if (!this.answerIsWrong) {
      this.data.correctlyAnswered = true;
      this.modalService.closeDialog();
    }
  }
}

export class QuizfrageData {
  question: QuestionModel;
  icon: string;
  correctlyAnswered: boolean;
}
