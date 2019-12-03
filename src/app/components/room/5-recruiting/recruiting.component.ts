import {Component, ElementRef, Inject, Renderer2, ViewChild} from '@angular/core';
import {AbstractRoom} from '../abstract-room';
import {DataService} from '../../../service/data.service';
import {ModalService} from '../../../service/modal.service';
import {ProgressService} from '../../../service/progress.service';
import {FeedbackInformatiktageComponent} from '../../base/feedback/feedback-informatiktage.component';
import {Howl} from 'howler';

@Component({
  selector: 'app-recruiting',
  templateUrl: './recruiting.component.html',
  styleUrls: ['./recruiting.component.scss']
})
export class RecruitingComponent extends AbstractRoom {

  @ViewChild('zora', {read: ElementRef}) private zora: ElementRef;
  @ViewChild('submarine', {read: ElementRef}) private submarine: ElementRef;
  @ViewChild('crazyfish', {read: ElementRef}) private crazyfish: ElementRef;
  @ViewChild('granit', {read: ElementRef}) private granit: ElementRef;
  @ViewChild('jellyfish', {read: ElementRef}) private jellyfish: ElementRef;
  @ViewChild('franco', {read: ElementRef}) private franco: ElementRef;
  @ViewChild('seestern', {read: ElementRef}) private seestern: ElementRef;
  @ViewChild('fishgroup', {read: ElementRef}) private fishgroup: ElementRef;

  starClickCounter = 0;
  clickToGetZora = 10;
  submarineClickCounter = 0;
  submarineClickable = true;

  crazyfishClass = 0;
  lastCrazyfishClass = 0;

  waitTimer = 0;

  private granitWhined = false;

  private sonarSound = new Howl({
    src: ['/assets/sound/sonar.mp3']
  });

  constructor(@Inject(DataService) protected readonly dataService: DataService,
              @Inject(ProgressService) protected readonly progressService: ProgressService,
              @Inject(ModalService) protected readonly modalService: ModalService,
              @Inject(Renderer2) protected readonly renderer: Renderer2) {
    super(dataService, progressService, modalService, renderer);
  }

  public crazyfishClick() {
    this.removeAllClassesFromCrazyfish();
    this.renderer.addClass(this.crazyfish.nativeElement, 'crazyfishStopAnimation');
    this.openInfo('room5coin2', '/assets/sprites/Room/5-recruiting/Crazy-Fish.svg');
  }

  public starClick() {
    if (this.starClickCounter < this.clickToGetZora) {
      this.starClickCounter++;
      this.renderer.setStyle(this.zora.nativeElement, 'transform', `translateY(calc(${this.starClickCounter} * -5%))`);
    }
  }

  public starReset() {
    if (this.starClickCounter < this.clickToGetZora) {
      this.starClickCounter = 0;
      this.renderer.setStyle(this.zora.nativeElement, 'transform', `translateY(0)`);
    }
  }

  public zoraClick() {
    if (this.starClickCounter >= this.clickToGetZora) {
      this.walkTo('zora', () => {
        this.openQuestion('room5coin1', '/assets/sprites/Room/5-recruiting/Zora.svg');
      });
    }
  }

  public jellyFishClick() {
    this.walkTo('jellyfish', () => {
      this.openQuestion('room5coin3', '/assets/sprites/Room/5-recruiting/Jellyfish.svg');
    });
  }

  public fishgroupClick() {
    this.openInfo('room5coin4', '/assets/sprites/Room/5-recruiting/Fishgroup.svg');
  }

  public async submarineClick() {
    if (!this.sonarSound.playing()) {
      this.sonarSound.play();
    }
    if (this.submarineClickable) {
      if (this.submarineClickCounter < 3) {
        this.submarineClickCounter++;
      }

      switch (this.submarineClickCounter) {
        case 1:
          this.renderer.addClass(this.submarine.nativeElement, 'mode1');
          break;
        case 2:
          this.renderer.addClass(this.submarine.nativeElement, 'mode2');
          this.renderer.removeClass(this.submarine.nativeElement, 'mode1');
          break;
        case 3:
          this.renderer.addClass(this.submarine.nativeElement, 'mode3');
          this.renderer.removeClass(this.submarine.nativeElement, 'mode2');
          break;
      }

      if (this.submarineClickCounter === 3) {
        this.pointerEvents(true);

        this.renderer.addClass(this.granit.nativeElement, 'granitVisible');
        let goCrazyFish = async () => {
          this.submarineClickable = false;
          this.submarineClickCounter = 0;

          this.waitTimer = this.getRandomInt(3000);
          await this.delay(this.waitTimer);
          this.waitTimer = 0;

          this.startCrazyFish();
          this.renderer.removeClass(this.submarine.nativeElement, 'mode3');
          await this.delay(2000);

          this.renderer.removeClass(this.granit.nativeElement, 'granitVisible');
          this.submarineClickable = true;
          this.pointerEvents(false);
        };

        if (this.granitWhined) {
          goCrazyFish();
        } else {
          this.granitWhined = true;
          this.openInfo('room5granit', '/assets/sprites/Room/5-recruiting/Granit.svg', () => goCrazyFish());
        }
      }
    }
  }

  public submarineReset() {
    this.submarineClickCounter = 0;
    this.renderer.removeClass(this.submarine.nativeElement, 'mode1');
    this.renderer.removeClass(this.submarine.nativeElement, 'mode2');
    this.renderer.removeClass(this.submarine.nativeElement, 'mode3');
  }

  public startCrazyFish() {
    this.removeAllClassesFromCrazyfish();

    this.crazyfishClass = this.getRandomInt(5);

    while (this.crazyfishClass === this.lastCrazyfishClass) {
      this.crazyfishClass = this.getRandomInt(5);
    }

    this.lastCrazyfishClass = this.crazyfishClass;
    this.renderer.addClass(this.crazyfish.nativeElement, 'crazyfish' + this.crazyfishClass);
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  private removeAllClassesFromCrazyfish() {
    for (let i = 0; i < 5; i++) {
      this.renderer.removeClass(this.crazyfish.nativeElement, 'crazyfish' + i);
    }
  }

  /*
   * Request Feedback and unlock Playground if feedback is completed.
   */
  public francoClick(): void {
    this.walkTo('franco', () => {
      if (!this.progress.feedbackCompleted) {
        this.openInfo('room5finishText', '/assets/sprites/Room/5-recruiting/Franco.svg', () => {
          this.openITDFeedback();
        });
      } else {
        this.openInfo('room5feedbackDanke', '/assets/sprites/Room/5-recruiting/Franco.svg');
      }
    });
  }

  public openITDFeedback(): void {
    if (!this.progress.feedbackCompleted) {
      this.modalService.openDialog(FeedbackInformatiktageComponent, true).subscribe(() => {
        if (this.progress.feedbackCompleted) {
          this.unlockPlayground();
        }
      });
    }
  }

  public unlockPlayground(): void {
    this.level.key = true;
    this.progressService.unlockLevel(this.level.level + 1);
    this.openReward(true, () => {
      this.openInfo('room5wettbewerb', '/assets/sprites/Icon/Pokal.svg');
    });
  }

  private pointerEvents(disabled: boolean) {
    if (disabled) {
      this.renderer.addClass(this.zora.nativeElement, 'no-pointer-events');
      this.renderer.addClass(this.submarine.nativeElement, 'no-pointer-events');
      this.renderer.addClass(this.granit.nativeElement, 'no-pointer-events');
      this.renderer.addClass(this.jellyfish.nativeElement, 'no-pointer-events');
      this.renderer.addClass(this.franco.nativeElement, 'no-pointer-events');
      this.renderer.addClass(this.seestern.nativeElement, 'no-pointer-events');
      this.renderer.addClass(this.fishgroup.nativeElement, 'no-pointer-events');
    } else {
      this.renderer.removeClass(this.zora.nativeElement, 'no-pointer-events');
      this.renderer.removeClass(this.submarine.nativeElement, 'no-pointer-events');
      this.renderer.removeClass(this.granit.nativeElement, 'no-pointer-events');
      this.renderer.removeClass(this.jellyfish.nativeElement, 'no-pointer-events');
      this.renderer.removeClass(this.franco.nativeElement, 'no-pointer-events');
      this.renderer.removeClass(this.seestern.nativeElement, 'no-pointer-events');
      this.renderer.removeClass(this.fishgroup.nativeElement, 'no-pointer-events');
    }
  }
}
