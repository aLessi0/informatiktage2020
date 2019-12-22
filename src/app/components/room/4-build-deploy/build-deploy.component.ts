import {Component, Inject, Renderer2} from '@angular/core';
import {AbstractRoom, Path} from '../abstract-room';
import {DataService} from '../../../service/data.service';
import {ModalService} from '../../../service/modal.service';
import {ProgressService} from '../../../service/progress.service';
import {Howl} from 'howler';

@Component({
  selector: 'app-build-deploy',
  templateUrl: './build-deploy.component.html',
  styleUrls: ['./build-deploy.component.scss']
})
export class BuildDeployComponent extends AbstractRoom {

  blancaHidden = true;
  private saloonSound = new Howl({
    src: ['/assets/sound/saloon.mp3']
  });

  constructor(@Inject(DataService) protected readonly dataService: DataService,
              @Inject(ProgressService) protected readonly progressService: ProgressService,
              @Inject(ModalService) protected readonly modalService: ModalService,
              @Inject(Renderer2) protected readonly renderer: Renderer2) {
    super(dataService, progressService, modalService, renderer);
  }

  public luckyClick(): void {
    this.walkTo('lucky', () => this.openQuestion('room4key', '/assets/sprites/Room/4-deploy-and-operate/Lucky.svg'));
  }

  public cactusBlueClick(): void {
    this.openInfo('room4cactus', '/assets/sprites/Room/4-deploy-and-operate/Cactus-blue.svg');
  }

  public blancaClick(): void {
    this.walkTo('lucky', () => this.openQuestion('room4coin1', '/assets/sprites/Room/4-deploy-and-operate/Blanca.svg'));
  }

  blancaVisible() {
    if (this.blancaHidden) {
      this.saloonSound.play();
    }
    this.blancaHidden = false;
  }

  protected initializePath(): Path {
    return {
      pathPoints: [
        {top: 33, left: 3, name: 'door'},
        {top: 36, left: 36},
        {top: 40, left: 44},
        {top: 45, left: 41},
        {top: 50, left: 23},
        {top: 54, left: 21},
        {top: 57.6, left: 32},
        {top: 64, left: 92},
        {top: 67, left: 103},
        {top: 84, left: 102},
        {top: 95, left: 86},
        {top: 95, left: 75, name: 'lucky'}
      ],
      timeInMs: 4000
    };
  }

}
