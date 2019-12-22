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

export interface Path {
  pathPoints: PathPoint[];
  timeInMs: number;
}

export interface PathPoint {
  top: number;
  left: number;
  name?: string;
}

interface Walking {
  walkingPoints: WalkingPoint[];
  walkingDistance: number;
}

interface WalkingPoint {
  top: number;
  left: number;
  timeInMs: number;
  distance: number;
}

export abstract class AbstractRoom implements OnInit {
  public room: RoomModel;
  public progress: ProgressModel;
  public level: PlayedLevelModel;

  @ViewChild(AvatarComponent, {read: ElementRef}) public avatarRef: ElementRef;

  private currentAvatarPosition = 'door';
  private isAvatarAnimationRunning = false;
  private path: Path;
  private readonly pathDistance: number;

  protected constructor(@Inject(DataService) protected readonly dataService: DataService,
                        @Inject(ProgressService) protected readonly progressService: ProgressService,
                        @Inject(ModalService) protected readonly modalService: ModalService,
                        @Inject(Renderer2) protected readonly renderer: Renderer2) {

    this.dataService.activeRoom$.subscribe(room => this.room = room);
    this.progressService.progress$.subscribe(progress => {
      this.progress = progress;
      this.level = this.progress.playedLevels.get(this.room.level);
    });
    this.path = this.initializePath();

    let maxDistance: number = 0;

    for (let i = 1; i < this.path.pathPoints.length; i++) {
      const previousPoint = this.path.pathPoints[i - 1];
      const currentPoint = this.path.pathPoints[i];

      const distance = this.calculateDistance(previousPoint, currentPoint);
      maxDistance += distance;
    }

    this.pathDistance = maxDistance;
  }

  public ngOnInit(): void {
    this.updateAvatarPosition('door');
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

    let pathPoints = this.calculateRelevantPathPoints(pos);
    let walkingAttributes = this.calculateWalkingAttributes(pathPoints);

    this.currentAvatarPosition = pos;

    let walkingStyleString = this.calculateStyleString(walkingAttributes);

    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'walkingStyle';
    style.innerHTML = walkingStyleString;
    document.head.appendChild(style);

    const animationClass = 'walking-animation';
    this.renderer.addClass(this.avatarRef.nativeElement, animationClass);
    this.updateAvatarPosition(pos);
    let animationStartCounter = 0;
    let animationEndCounter = 0;
    const animationEndFunction = () => {
      animationEndCounter++;
      setTimeout(() => {
        if (animationStartCounter === animationEndCounter) {
          this.avatarRef.nativeElement.removeEventListener('animationend', animationEndFunction);
          this.avatarRef.nativeElement.removeEventListener('animationstart', animationStartFunction);
          this.renderer.removeClass(this.avatarRef.nativeElement, animationClass);
          const style = document.getElementById('walkingStyle') as HTMLStyleElement;
          document.head.removeChild(style);
          this.isAvatarAnimationRunning = false;
          callback && callback();
        }
      }, 50);
    };
    const animationStartFunction = () => {
      animationStartCounter++;
    };
    this.avatarRef.nativeElement.addEventListener('animationend', animationEndFunction);
    this.avatarRef.nativeElement.addEventListener('animationstart', animationStartFunction);
  }

  public openInfo(key: string, icon: string, callback?): void {
    if (this.isAvatarAnimationRunning) {
      return;
    }
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

  protected abstract initializePath(): Path;

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

  private calculateRelevantPathPoints(pos: string): PathPoint[] {
    let startPointIndex: number = this.getPathPointIndexByName(this.currentAvatarPosition);
    let endPointIndex: number = this.getPathPointIndexByName(pos);

    let relevantPathPoints: PathPoint[];
    if (startPointIndex < endPointIndex) {
      relevantPathPoints = this.path.pathPoints.slice(startPointIndex, endPointIndex + 1);
    } else {
      relevantPathPoints = this.path.pathPoints.slice(endPointIndex, startPointIndex + 1).reverse();
    }

    return relevantPathPoints;
  }

  private getPathPointIndexByName(name: string): number {
    for (let i = 0; i < this.path.pathPoints.length; i++) {
      const point = this.path.pathPoints[i];
      if (point.name === name) {
        return i;
      }
    }

    return -1;
  }

  private calculateWalkingAttributes(pathPoints: PathPoint[]): Walking {
    const walkingPoints: WalkingPoint[] = [];
    const walking: Walking = {
      walkingPoints,
      walkingDistance: 0
    };

    for (let i = 0; i < pathPoints.length; i++) {
      let previousIndex: number = i === 0 ? 0 : i - 1;
      const currentIndex: number = i;
      const previousPoint = pathPoints[previousIndex];
      const currentPoint = pathPoints[currentIndex];

      const distance = this.calculateDistance(previousPoint, currentPoint);
      walking.walkingDistance += distance;

      const time = this.path.timeInMs / this.pathDistance * distance;
      walkingPoints.push({
        top: currentPoint.top,
        left: currentPoint.left,
        distance: distance,
        timeInMs: time
      });
    }

    return walking;
  }

  private calculateStyleString(walkingAttributes: Walking): string {
    let keyframeString: string = '@keyframes walkingAnimation {\n';
    let percentage: number = 0;
    let totalTime: number = 0;
    for (const walkingPoint of walkingAttributes.walkingPoints) {
      percentage += 100 / walkingAttributes.walkingDistance * walkingPoint.distance;
      totalTime += walkingPoint.timeInMs;
      keyframeString += '\t' + percentage + '% {\n';
      keyframeString += '\t\ttop: ' + walkingPoint.top + '%;\n';
      keyframeString += '\t\tleft: ' + walkingPoint.left + '%;\n';
      keyframeString += '\t}\n';
    }

    const walkingClass: string = '.walking-animation {\n\tanimation: walkingAnimation ' + totalTime + 'ms linear;\n}';

    return walkingClass + '\n\n' + keyframeString;
  }

  private calculateDistance(p1: PathPoint, p2: PathPoint): number {
    // dies /9 oder /20 wird gebraucht weil wir dieses Verhältnis haben in der Applikation damit die Prozentzahlen stimmen
    return Math.hypot((p2.top - p1.top) / 9, (p2.left - p1.left) / 20);
  }

  private updateAvatarPosition(pos: string): void {
    let pathPointIndex = this.getPathPointIndexByName(pos);
    let pathPoint = this.path.pathPoints[pathPointIndex];

    this.renderer.setStyle(this.avatarRef.nativeElement, 'position', 'absolute');
    this.renderer.setStyle(this.avatarRef.nativeElement, 'top', pathPoint.top + '%');
    this.renderer.setStyle(this.avatarRef.nativeElement, 'left', pathPoint.left + '%');
  }

}
