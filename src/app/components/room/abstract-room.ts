import {Inject} from '@angular/core';
import {RoomModel} from '../../model/game/room.model';
import {QuestionModel} from '../../model/game/question.model';
import {QuizfrageComponent, QuizfrageData} from '../base/quizfrage/quizfrage.component';
import {InfotextComponent} from '../base/infotext/infotext.component';
import {DataService} from '../../service/data.service';
import {ModalService} from '../../service/modal.service';
import {InfoModel} from '../../model/game/info.model';
import {ProgressModel} from '../../model/user/progress.model';
import {ProgressService} from '../../service/progress.service';
import {PlayedLevelModel} from '../../model/user/played-level.model';

export class AbstractRoom {
  public room: RoomModel;
  public progress: ProgressModel;
  public level: PlayedLevelModel;

  constructor(@Inject(DataService) protected readonly dataService: DataService,
              @Inject(ProgressService) protected readonly progressService: ProgressService,
              @Inject(ModalService) protected readonly modalService: ModalService) {

    this.dataService.activeRoom$.subscribe(room => this.room = room);
    this.progressService.progress$.subscribe(progress => {
      this.progress = progress;
      this.level = this.progress.playedLevels.get(this.room.level);
    });
  }

  public openInfo(key: string, icon: string, callback?): void {
    const info = this.getInfoByKey(key);

    console.log('--------> open info: ', info);

    if (info.givesCoin) { // info anzeigen mit coin

      if (this.level.coins.indexOf(key) < 0) { // prüfen ob coin nicht bereits erhalten

        // coin noch nicht erhalten
        this.modalService.openDialog(InfotextComponent, false, { icon, text: info.text }).subscribe(() => {
          this.level.coins.push(key);
          this.progress.numberOfCollectedCoins++;
          this.openReward(false, callback);
        });

      } else { // wenn coin bereits erhalten

        // meldung dass coin bereits erhalten anzeigen
        this.modalService.openDialog(InfotextComponent, false, { icon, text: 'Du hast diese Münze bereits gefunden!' }).subscribe(() => {
          if (callback) {
            callback();
          }
        });
      }

    } else { // info anzeigen ohne coin

      this.modalService.openDialog(InfotextComponent, false, { icon, text: info.text }).subscribe(() => {
        if (callback) {
          callback();
        }
      });
    }
  }

  public openQuestion(key: string, icon: string, callback?): void {
    const question = this.getQuestionByKey(key);
    const bereitsBeantwortet = (question.isMandatory && this.level.key) || (!question.isMandatory && this.level.coins.indexOf(key) >= 0);

    const data: QuizfrageData = {
      question,
      icon,
      correctlyAnswered: false
    };

    if (!bereitsBeantwortet) {
      this.modalService.openDialog(QuizfrageComponent, false, data).subscribe(() => {

        // TODO
        console.log('-----------> in beantwortet with data: ', data);

        if (data.correctlyAnswered) {
          if (question.isMandatory) {
            this.level.key = true;
            this.progressService.unlockLevel(this.level.level + 1);
            this.openReward(true, callback);
          } else {
            this.level.coins.push(key);
            this.progress.numberOfCollectedCoins++;
            this.progressService.updateProgress(this.progress);
            this.openReward(false, callback);
          }

        } else if (callback) {
          callback();
        }
      });

    } else {
      // Frage wurde bereits einmal beantwortet
      this.modalService.openDialog(InfotextComponent, false, { icon, text: 'Du hast diese Frage bereits beantwortet!' }).subscribe(() => {
        if (callback) {
          callback();
        }
      });
    }
  }

  private openReward(mandatory: boolean, callback?): void {
    const icon = mandatory ? '/assets/sprites/Room/Credits/Key-active.svg' : '/assets/sprites/Room/Credits/Coin-active.svg';
    const text = mandatory ? 'Gratulation! Du hast den Schlüssel für den nächsten Raum erhalten!' : 'Du hast eine Münze erhalten!';
    this.modalService.openDialog(InfotextComponent, false, {icon, text}).subscribe(() => {
      if (callback) {
        callback();
      }
    });
  }

  private getQuestionByKey(key: string): QuestionModel {
    for (const question of this.room.questions) {
      if (question.key === key) {
        return question;
      }
    }
  }

  private getInfoByKey(key: string): InfoModel {
    for (const info of this.room.infos) {
      if (info.key === key) {
        return info;
      }
    }
  }

}
