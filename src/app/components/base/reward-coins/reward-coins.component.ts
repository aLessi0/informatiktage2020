import {Component, Inject, Input, OnInit} from '@angular/core';
import {ProgressModel} from "../../../model/user/progress.model";
import {DataService} from "../../../service/data.service";
import {ProgressService} from "../../../service/progress.service";
import {ModalService} from "../../../service/modal.service";
import {GameModel} from "../../../model/game/game.model";

@Component({
  selector: 'app-reward-coins',
  templateUrl: './reward-coins.component.html',
  styleUrls: ['./reward-coins.component.scss']
})
export class RewardCoinsComponent {
  public progress: ProgressModel;
  public nrOfCoinsInGame: number = 12;
  public password: string;
  public alreadyCollected: boolean;

  constructor(@Inject(DataService) private readonly dataService: DataService,
              @Inject(ProgressService) private readonly progressService: ProgressService
  ) {
    this.progressService.progress$.subscribe(progress => {
      this.progress = progress;
    });
  }

  public validateAnswer(): void {
    console.log("DEBUG: Ich bin in validateAnswer");
    const answerIsCorrect = this.password === '123';

    if (answerIsCorrect) {
      console.log("DEBUG: Ich bin TRUE");
      this.progressService.progress$.subscribe(progress => {
        this.progress.collectedReward = true;
      });
    }

    this.progressService.updateProgress(this.progress);
  }
}
