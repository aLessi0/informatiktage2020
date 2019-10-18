import {Component, ElementRef, Inject, Renderer2, ViewChild} from '@angular/core';
import {AbstractRoom} from '../abstract-room';
import {DataService} from '../../../service/data.service';
import {ModalService} from '../../../service/modal.service';
import {ProgressService} from '../../../service/progress.service';
import {FeedbackInformatiktageComponent} from '../../base/feedback/feedback-informatiktage.component';

@Component({
  selector: 'app-recruiting',
  templateUrl: './recruiting.component.html',
  styleUrls: ['./recruiting.component.scss']
})
export class RecruitingComponent extends AbstractRoom {

  @ViewChild('zora', {read: ElementRef}) private zora: ElementRef;
  @ViewChild('submarine', {read: ElementRef}) private submarine: ElementRef;
  @ViewChild('crazyfish', {read: ElementRef}) private crazyfish: ElementRef;

  starClickCounter = 0;
  clickToGetZora = 10;
  submarineClickCounter = 0;

  crazyfishClass = 0;

  waitTimer = 0;

  constructor(@Inject(DataService) protected readonly dataService: DataService,
              @Inject(ProgressService) protected readonly progressService: ProgressService,
              @Inject(ModalService) protected readonly modalService: ModalService,
              @Inject(Renderer2) private readonly renderer: Renderer2) {
    super(dataService, progressService, modalService);
  }

  public crazyfishClick() {
    this.openInfo('room5coin2', '/assets/sprites/Room/5-recruiting/Crazy-Fish.svg');
  }

  public starClick() {
    if (this.starClickCounter < this.clickToGetZora) {
      this.starClickCounter++;
      this.renderer.setStyle(this.zora.nativeElement, 'transform', `translateY(calc(${this.starClickCounter} * -5%))`);
    }
  }

  public zoraClick() {
    if (this.starClickCounter >= this.clickToGetZora) {
      this.openQuestion('room5coin1', '/assets/sprites/Room/5-recruiting/Zora.svg');
    }
  }

  public async submarineClick() {
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
      this.submarineClickCounter = 0;

      this.waitTimer = this.getRandomInt(3000);
      await this.delay(this.waitTimer);
      this.waitTimer = 0;

      this.startCrazyFish();
      this.renderer.removeClass(this.submarine.nativeElement, 'mode3');
    }
  }

  public startCrazyFish() {
    this.removeAllClassesFromCrazyfish();

    this.crazyfishClass = this.getRandomInt(4);
    this.renderer.addClass(this.crazyfish.nativeElement, 'crazyfish' + this.crazyfishClass);
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  private removeAllClassesFromCrazyfish() {
    for (let i = 0; i < 4; i++) {
      this.renderer.removeClass(this.crazyfish.nativeElement, 'crazyfish' + i);
    }
  }

  /*
   * Request Feedback and unlock Playground if feedback is completed.
   */

  public francoClick(): void {
    if(!this.level.key) {
        this.openInfo('room5finishText', '/assets/sprites/Room/5-recruiting/Franco.svg', () => {
          this.openITDFeedback();
        });
    }  else {
      this.openInfo('room5feedbackDanke', '/assets/sprites/Room/5-recruiting/Franco.svg');
    }
  }

  public openITDFeedback(): void {
    if(!this.progress.feedbackCompleted) {
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
    this.openReward(true);
  }
}
