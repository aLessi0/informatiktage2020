import {ElementRef, Inject, OnInit, Renderer2, ViewChild} from '@angular/core';
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
import {AvatarComponent} from '../avatar/avatar.component';

export class AbstractRoom implements OnInit {
  public room: RoomModel;
  public progress: ProgressModel;
  public level: PlayedLevelModel;

  @ViewChild(AvatarComponent, {read: ElementRef}) private avatarRef: ElementRef;

  private currentAvatarPosition = 'door';
  private isAvatarAnimationRunning = false;

  constructor(@Inject(DataService) protected readonly dataService: DataService,
              @Inject(ProgressService) protected readonly progressService: ProgressService,
              @Inject(ModalService) protected readonly modalService: ModalService,
              @Inject(Renderer2) protected readonly renderer: Renderer2) {

    this.dataService.activeRoom$.subscribe(room => this.room = room);
    this.progressService.progress$.subscribe(progress => {
      this.progress = progress;
      this.level = this.progress.playedLevels.get(this.room.level);
    });
  }

  public ngOnInit(): void {
    this.renderer.addClass(this.avatarRef.nativeElement, 'initialAnimation');
    this.isAvatarAnimationRunning = true;
    this.avatarRef.nativeElement.addEventListener('animationend', () => {
      this.renderer.removeClass(this.avatarRef.nativeElement, 'initialAnimation');
      this.isAvatarAnimationRunning = false;
    });
  }

  public walkTo(pos: string, callback: () => void): void {
    if (this.isAvatarAnimationRunning) {
      return;
    }
    if (pos === this.currentAvatarPosition) {
      callback && callback();
      return;
    }
    this.isAvatarAnimationRunning = true;
    const oldClassName: string = 'pos-' + this.currentAvatarPosition;
    this.renderer.removeClass(this.avatarRef.nativeElement, oldClassName);

    const className: string = 'pos-' + pos;
    const animationClass: string = 'walk-' + this.currentAvatarPosition + '-' + pos;

    this.currentAvatarPosition = pos;

    if (pos !== 'door') {
      this.renderer.addClass(this.avatarRef.nativeElement, className);
    }
    this.renderer.addClass(this.avatarRef.nativeElement, animationClass);
    let animationRunning = false;
    const animationEndFunction = () => {
      animationRunning = false;
      setTimeout(() => {
        if (!animationRunning) {
          this.avatarRef.nativeElement.removeEventListener('animationend', animationEndFunction);
          this.avatarRef.nativeElement.removeEventListener('animationstart', animationStartFunction);
          this.renderer.removeClass(this.avatarRef.nativeElement, animationClass);
          this.isAvatarAnimationRunning = false;
          callback && callback();
        }
      }, 50);
    };
    const animationStartFunction = () => {
      animationRunning = true;
    };
    this.avatarRef.nativeElement.addEventListener('animationend', animationEndFunction);
    this.avatarRef.nativeElement.addEventListener('animationstart', animationStartFunction);
  }

  public openInfo(key: string, icon: string, callback?): void {
    const info = this.getInfoByKey(key);

    if (info.givesCoin) { // info anzeigen mit coin

      if (this.level.coins.indexOf(key) < 0) { // prüfen ob coin nicht bereits erhalten

        // coin noch nicht erhalten
        this.modalService.openDialog(InfotextComponent, true, {icon, text: info.text}).subscribe(() => {
          this.level.coins.push(key);
          this.progress.numberOfCollectedCoins++;
          this.openReward(false, callback);
        });

      } else { // wenn coin bereits erhalten

        // meldung dass coin bereits erhalten anzeigen
        this.modalService.openDialog(InfotextComponent, true, {
          icon,
          text: 'Du hast diese Münze bereits gefunden!'
        }).subscribe(() => {
          if (callback) {
            callback();
          }
        });
      }

    } else { // info anzeigen ohne coin

      this.modalService.openDialog(InfotextComponent, true, {icon, text: info.text}).subscribe(() => {
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
        if (data.correctlyAnswered) {
          if (question.isMandatory) {
            this.level.key = true;
            this.progressService.unlockLevel(this.level.level + 1);
            this.openReward(true, callback);
          } else {
            this.level.coins.push(key);
            this.progress.numberOfCollectedCoins++;
            this.openReward(false, callback);
          }

        } else if (callback) {
          callback();
        }
      });

    } else {
      // Frage wurde bereits einmal beantwortet
      this.modalService.openDialog(InfotextComponent, true, {
        icon,
        text: 'Du hast meine Frage bereits beantwortet!'
      }).subscribe(() => {
        if (callback) {
          callback();
        }
      });
    }
  }

  protected openReward(mandatory: boolean, callback?): void {
    const icon = mandatory ? '/assets/sprites/Room/Credits/Key-active.svg' : '/assets/sprites/Room/Credits/Coin-active.svg';
    const text = mandatory ? 'Gratulation! Du hast den Schlüssel für den nächsten Raum erhalten!' : 'Du hast eine Münze erhalten!';
    this.modalService.openDialog(InfotextComponent, true, {icon, text, isReward: true}).subscribe(() => {
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
