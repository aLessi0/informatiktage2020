import {Component, Inject, OnInit} from '@angular/core';
import {QuestionModel} from "../../../model/game/question.model";
import {RoomModel} from "../../../model/game/room.model";
import {ProgressModel} from "../../../model/user/progress.model";
import {AnswerModel} from "../../../model/user/answer.model";
import {PlayedLevelModel} from "../../../model/user/played-level.model";
import {DataService} from "../../../service/data.service";
import {ProgressService} from "../../../service/progress.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-reward-coins',
  templateUrl: './reward-coins.component.html',
  styleUrls: ['./reward-coins.component.scss']
})
export class RewardCoinsComponent {
  private progress: ProgressModel;
  private password: string;

  constructor(@Inject(DataService) private readonly dataService: DataService,
              @Inject(ProgressService) private readonly progressService: ProgressService) {
  }

  public validateAnswer(): void {
    const answerIsCorrect = this.password === '123';

    if (answerIsCorrect) {
      this.progressService.progress$.subscribe(progress => {
        this.progress.collectedReward = true;
      });
    }

    this.progressService.updateProgress(this.progress);
  }
}
