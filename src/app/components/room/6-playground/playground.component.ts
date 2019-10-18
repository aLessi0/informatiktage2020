import {Component, ElementRef, Inject, Renderer2, ViewChild} from '@angular/core';
import {AbstractRoom} from '../abstract-room';
import {DataService} from '../../../service/data.service';
import {ModalService} from '../../../service/modal.service';
import {ProgressService} from '../../../service/progress.service';
import {MovieComponent} from "../../base/movie/movie.component";

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

  constructor(@Inject(DataService) protected readonly dataService: DataService,
              @Inject(ProgressService) protected readonly progressService: ProgressService,
              @Inject(ModalService) protected readonly modalService: ModalService,
              @Inject(Renderer2) protected readonly renderer: Renderer2) {
    super(dataService, progressService, modalService, renderer);
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  public entryAbaton(): void {
    this.modalService.openDialog(MovieComponent, false, {
    }).subscribe(() => {});
  }

  public leoLogic() {
    if (!this.scavengerHuntRunning) {
      this.openInfo('room6ScavengerHuntLeo1', '/assets/sprites/Room/6-playground/Leo.svg');
      this.scavengerHuntRunning = true;
    } else if (this.scavengerHuntRunning && !this.foundFishingRod) {
      this.openInfo('room6ScavengerHuntLeo2', '/assets/sprites/Room/6-playground/Leo.svg');
    } else if (this.scavengerHuntRunning && this.foundFishingRod) {
      this.openInfo('room6ScavengerHuntLeo3', '/assets/sprites/Room/6-playground/Leo.svg');
    }
  }

  public lillyLogic(){
    if(!this.scavengerHuntRunning) {
      this.openInfo('room6ScavengerHuntLilly1', '/assets/sprites/Room/6-playground/Lilly.svg');
    } else if (this.scavengerHuntRunning && !this.treeQuestRunning) {
      this.treeQuestRunning = true;
      this.openInfo('room6ScavengerHuntLilly2', '/assets/sprites/Room/6-playground/Lilly.svg');
    }
  }

  public heidiLogic(){
    if (!this.scavengerHuntRunning) {
      this.openQuestion('room6coin1', '/assets/sprites/Room/6-playground/Heidi.svg');
    } else {
      this.openInfo('room6ScavengerHuntHeidi1', '/assets/sprites/Room/6-playground/Heidi.svg')
    }
  }

  public  treeClick(treeNumber: number) {

    this.renderer.addClass(this.tree1.nativeElement, 'treeClicked');
  }
}
