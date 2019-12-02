import {Component, Inject, OnInit} from '@angular/core';
import {ProgressModel} from '../../../model/user/progress.model';
import {DataService} from '../../../service/data.service';
import {ProgressService} from '../../../service/progress.service';
import {GameModel} from '../../../model/game/game.model';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-reward-coins',
  templateUrl: './reward-coins.component.html',
  styleUrls: ['./reward-coins.component.scss']
})
export class RewardCoinsComponent implements OnInit {
  public progress: ProgressModel;
  public game: GameModel;
  public password: string;
  public mainText: string;

  constructor(@Inject(DataService) private readonly dataService: DataService,
              @Inject(ProgressService) private readonly progressService: ProgressService,
              @Inject(MAT_DIALOG_DATA) private readonly data: any) {
    this.game = data.game;
    this.progress = data.progress;
  }

  public ngOnInit(): void {
    if (this.progress.numberOfCollectedCoins >= this.game.minCoinsRewardSmall &&
        this.progress.numberOfCollectedCoins < this.game.minCoinsRewardBig) {

      this.mainText = '<h1> Gratuliere!</h1>';
      this.mainText += ' Du hast <b>' + this.progress.numberOfCollectedCoins + '</b> von insgesamt <b>' + this.game.numberOfCoinsInGame;
      this.mainText += '</b> Münzen gesammelt. Du hast dir einen kleinen Preis verdient. Löse deine Münzen beim Sofortpreisestand ein.';
      this.mainText += '<br/><br/> Aber Achtung. Du kannst die Münzen nur einmal einlösen,' +
                       ' also überlege dir gut, ob du noch weiter sammeln möchtest.';

    } else if (this.progress.numberOfCollectedCoins >= this.game.minCoinsRewardBig) {
      this.mainText = '<h1> Gratuliere!</h1>';
      if (this.progress.numberOfCollectedCoins !== this.game.numberOfCoinsInGame) {
        this.mainText += ' Du hast <b>' + this.progress.numberOfCollectedCoins +
          '</b> von insgesamt <b>' + this.game.numberOfCoinsInGame + '</b> Münzen gesammelt.';
      } else {
        this.mainText += ' Du hast <b> alle </b> Münzen gesammelt.';
      }
      this.mainText = this.mainText + ' Du hast dir den grossen Preis verdient. Löse deine Münzen beim Sofortpreisestand ein.';
      if (this.progress.numberOfCollectedCoins !== this.game.numberOfCoinsInGame) {
        this.mainText += '<br/><br/> Aber Achtung. Du kannst die Münzen nur einmal einlösen, also überlege dir gut,' +
          ' ob du noch weiter sammeln möchtest.';
      }
    } else {
      this.mainText = '<h1> Hoppla!</h1>';
      this.mainText = this.mainText + 'Du hast <b>' + this.progress.numberOfCollectedCoins +
        '</b> von insgesamt <b>' + this.game.numberOfCoinsInGame + '</b> Münzen gesammelt. Du brauchst mindestens <b>'
        + this.game.minCoinsRewardSmall + '</b> Münzen für den kleinen Preis.<br/><br/> Sammle weiter um einen Preis zu bekommen.';
    }
  }

  public validateAnswer(): void {
    if (this.password === '314159') {
      this.progressService.progress$.subscribe(progress => {
        this.progress.coinsBereitsEingeloest = true;
      });
    }

    this.progressService.updateProgress(this.progress);
  }
}
