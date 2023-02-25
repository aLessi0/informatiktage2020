import {Component, Inject, Renderer2} from '@angular/core';
import {DataService} from '../../../service/data.service';
import {ModalService} from '../../../service/modal.service';
import {AbstractRoom, Path} from '../abstract-room';
import {ProgressService} from '../../../service/progress.service';
import {Howl} from 'howler';

@Component({
  selector: 'app-welt-der-informatik',
  templateUrl: './welt-der-informatik.component.html',
  styleUrls: ['./welt-der-informatik.component.scss']
})
export class WeltDerInformatikComponent extends AbstractRoom {

  private planeSound = new Howl({
    src: ['/assets/sound/flugzeug.mp3']
  });

  constructor(@Inject(DataService) protected readonly dataService: DataService,
              @Inject(ProgressService) protected readonly progressService: ProgressService,
              @Inject(ModalService) protected readonly modalService: ModalService,
              @Inject(Renderer2) protected readonly renderer: Renderer2) {
    super(dataService, progressService, modalService, renderer);
  }

  public onRetoTab() {
    this.walkTo('reto', () => {
      if (this.level.key) {
        this.openQuestion('room1coin1', '/assets/sprites/Room/1-welt-der-informatik/Reto.svg');
      } else {
        this.openInfo('room1info1', '/assets/sprites/Room/1-welt-der-informatik/Reto.svg');
      }
    });
  }

  public onMarieTab() {
    this.walkTo('marie', () => this.openQuestion('room1key', '/assets/sprites/Room/1-welt-der-informatik/Marie.svg'));
  }

  public onPlaneTab() {
    if (!this.planeSound.playing()) {
      this.planeSound.play();
    }
    this.openInfo('room1flugi', '/assets/sprites/Room/1-welt-der-informatik/Airplane.svg');
  }

  protected initializePath(): Path {
    return {
      pathPoints: [
        {top: 39, left: -3, name: 'door'},
        {top: 37, left: 70},
        {top: 40, left: 96},
        {top: 51, left: 103},
        {top: 56, left: 81},
        {top: 49, left: 37},
        {top: 51, left: 25, name: 'reto'},
        {top: 64, left: 6},
        {top: 82, left: 3},
        {top: 92, left: 9},
        {top: 98, left: 22},
        {top: 99, left: 51},
        {top: 95, left: 80, name: 'marie'}
      ],
      timeInMs: 4000
    };
  }
}
