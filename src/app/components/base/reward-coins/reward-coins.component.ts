import {Component, Inject} from '@angular/core';
import {ProgressModel} from '../../../model/user/progress.model';
import {DataService} from '../../../service/data.service';
import {ProgressService} from '../../../service/progress.service';
import {GameModel} from '../../../model/game/game.model';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-reward-coins',
  templateUrl: './reward-coins.component.html',
  styleUrls: ['./reward-coins.component.scss']
})
export class RewardCoinsComponent {
  private progress: ProgressModel;
  private nrOfCoinsInGame: number;
  private password: string;

  constructor(@Inject(DataService) private readonly dataService: DataService,
              @Inject(MAT_DIALOG_DATA) public game: GameModel,
              @Inject(ProgressService) private readonly progressService: ProgressService
  ) {
    this.progressService.progress$.subscribe(progress => {
      this.progress = progress;
      this.nrOfCoinsInGame = game.numberOfCoinsInGame;
    });
  }

  public validateAnswer(): void {
    const answerIsCorrect = this.password === '123';

    if (answerIsCorrect) {
      this.progressService.progress$.subscribe(progress => {
        this.progress.coinsBereitsEingeloest = true;
      });
    }

    this.progressService.updateProgress(this.progress);
  }
}
