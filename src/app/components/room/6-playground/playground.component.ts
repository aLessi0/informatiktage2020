import {Component, ElementRef, Inject, Renderer2, ViewChild} from '@angular/core';
import {AbstractRoom, Path} from '../abstract-room';
import {DataService} from '../../../service/data.service';
import {ModalService} from '../../../service/modal.service';
import {ProgressService} from '../../../service/progress.service';
import {MovieComponent} from '../../base/movie/movie.component';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent extends AbstractRoom {

  @ViewChild('tree1', {read: ElementRef}) private tree1: ElementRef;
  @ViewChild('tree2', {read: ElementRef}) private tree2: ElementRef;
  @ViewChild('tree3', {read: ElementRef}) private tree3: ElementRef;
  @ViewChild('tree4', {read: ElementRef}) private tree4: ElementRef;

  public scavengerHuntRunning = false;
  public foundFishingRod = false;
  public treeQuestRunning = false;
  public broughtFishingRodToLeo = false;
  public tree1Clicked = false;
  public tree2Clicked = false;
  public tree3Clicked = false;
  public tree4Clicked = false;
  public francoFished = false;
  public solution = '';

  constructor(@Inject(DataService) protected readonly dataService: DataService,
              @Inject(ProgressService) protected readonly progressService: ProgressService,
              @Inject(ModalService) protected readonly modalService: ModalService,
              @Inject(Renderer2) protected readonly renderer: Renderer2) {
    super(dataService, progressService, modalService, renderer);
  }

  public cloudClick(): void {
    this.openInfo('room6credits', '/assets/sprites/Icon/Map/cloud-right.svg');
  }

  public entryAbaton(): void {
    this.walkTo('arnold', () => this.modalService.openDialog(MovieComponent, false, {}).subscribe(() => {}));
  }

  public leoLogic() {
    this.walkTo('leo', () => {
      if (!this.scavengerHuntRunning) {
        this.openInfo('room6ScavengerHuntLeo1', '/assets/sprites/Room/6-playground/Leo.svg');
        this.scavengerHuntRunning = true;
      } else if (this.scavengerHuntRunning && !this.foundFishingRod) {
        this.openInfo('room6ScavengerHuntLeo2', '/assets/sprites/Room/6-playground/Leo.svg');
      } else if (this.scavengerHuntRunning && this.foundFishingRod) {
        this.broughtFishingRodToLeo = true;
        this.openInfo('room6ScavengerHuntLeo3', '/assets/sprites/Room/6-playground/Leo.svg');
      }
    });
  }

  public lillyLogic() {
    this.walkTo('lilly', () => {
      if (!this.scavengerHuntRunning) {
        this.openInfo('room6ScavengerHuntLilly1', '/assets/sprites/Room/6-playground/Lilly.svg');
      } else if (this.scavengerHuntRunning && !this.treeQuestRunning) {
        this.treeQuestRunning = true;
        this.openInfo('room6ScavengerHuntLilly2', '/assets/sprites/Room/6-playground/Lilly.svg');
      } else if (this.scavengerHuntRunning && this.treeQuestRunning) {
        if (this.solution === '3142') {
          this.foundFishingRod = true;
          this.treeQuestRunning = false;
          this.openInfo('room6ScavengerHuntLilly4', '/assets/sprites/Room/6-playground/Lilly.svg', () => {
            this.openInfo('room6ScavengerHuntLilly5', '/assets/sprites/Room/6-playground/FishingRod.svg');
          });
        } else {
          this.openInfo('room6ScavengerHuntLilly3', '/assets/sprites/Room/6-playground/Lilly.svg');
        }
      }
    });
  }

  public heidiLogic() {
    this.walkTo('heidi', () => {
      if (!this.scavengerHuntRunning) {
        this.openQuestion('room6coin1', '/assets/sprites/Room/6-playground/Heidi.svg');
      } else {
        this.openInfo('room6ScavengerHuntHeidi1', '/assets/sprites/Room/6-playground/Heidi.svg');
      }
    });
  }

  public treeClick(treeNumber: number) {
    if (this.treeQuestRunning) {
      this.walkTo('lilly', () => {
        if (treeNumber === 1 && !this.tree1Clicked) {
          this.tree1Clicked = true;
          this.renderer.addClass(this.tree1.nativeElement, 'treeClicked');
          this.solution = this.solution + '1';
        } else if (treeNumber === 2 && !this.tree2Clicked) {
          this.tree2Clicked = true;
          this.renderer.addClass(this.tree2.nativeElement, 'treeClicked');
          this.solution = this.solution + '2';
        } else if (treeNumber === 3 && !this.tree3Clicked) {
          this.tree3Clicked = true;
          this.renderer.addClass(this.tree3.nativeElement, 'treeClicked');
          this.solution = this.solution + '3';
        } else if (treeNumber === 4 && !this.tree4Clicked) {
          this.tree4Clicked = true;
          this.renderer.addClass(this.tree4.nativeElement, 'treeClicked');
          this.solution = this.solution + '4';
        }

        if (this.tree1Clicked && this.tree2Clicked && this.tree3Clicked && this.tree4Clicked) {
          if (this.solution === '3142') {
            this.openInfo('room6ScavengerHuntTreeCorrect', '/assets/sprites/Room/6-playground/Tree.svg');
          } else {
            this.openInfo('room6ScavengerHuntTreeWrong', '/assets/sprites/Room/6-playground/Tree.svg');
            this.resetTrees();
            this.solution = '';
          }
        }
      });
    }
  }

  public resetTrees() {
    this.tree1Clicked = false;
    this.tree2Clicked = false;
    this.tree3Clicked = false;
    this.tree4Clicked = false;

    this.renderer.removeClass(this.tree1.nativeElement, 'treeClicked');
    this.renderer.removeClass(this.tree2.nativeElement, 'treeClicked');
    this.renderer.removeClass(this.tree3.nativeElement, 'treeClicked');
    this.renderer.removeClass(this.tree4.nativeElement, 'treeClicked');
  }

  public fishing() {
    if (this.foundFishingRod && this.scavengerHuntRunning && this.broughtFishingRodToLeo) {
      this.walkTo('leo', () => {
        this.francoFished = true;
      });
    }
  }

  public francoClick() {
    this.openInfo('room6ScavengerHuntCoin', '/assets/sprites/Room/5-recruiting/Franco.svg');
    this.scavengerHuntRunning = false;
    this.foundFishingRod = false;
    this.treeQuestRunning = false;
    this.broughtFishingRodToLeo = false;
  }

  protected initializePath(): Path {
    return {
      pathPoints: [
        {top: 30, left: 3, name: 'door'},
        {top: 25, left: 33},
        {top: 26, left: 50, name: 'arnold'},
        {top: 43, left: 68, name: 'heidi'},
        {top: 49, left: 72},
        {top: 54, left: 68},
        {top: 56, left: 53, name: 'lilly'},
        {top: 57, left: 39},
        {top: 61, left: 25},
        {top: 71, left: 8},
        {top: 77, left: 4},
        {top: 82, left: 4},
        {top: 88, left: 12},
        {top: 92, left: 21},
        {top: 96, left: 50},
        {top: 94.5, left: 64, name: 'leo'}
      ],
      timeInMs: 4000
    };
  }

}
