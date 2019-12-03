import {Component, Inject, Renderer2} from '@angular/core';
import {AbstractRoom} from '../abstract-room';
import {DataService} from '../../../service/data.service';
import {ModalService} from '../../../service/modal.service';
import {ProgressService} from '../../../service/progress.service';

@Component({
  selector: 'app-build-deploy',
  templateUrl: './build-deploy.component.html',
  styleUrls: ['./build-deploy.component.scss']
})
export class BuildDeployComponent extends AbstractRoom {

  blancaHidden = true;

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
    this.blancaHidden = false;
  }

}
