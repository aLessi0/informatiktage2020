import {Component, Inject, Renderer2} from '@angular/core';
import {DataService} from '../../../service/data.service';
import {ModalService} from '../../../service/modal.service';
import {AbstractRoom} from '../abstract-room';
import {ProgressService} from '../../../service/progress.service';

@Component({
  selector: 'app-welt-der-informatik',
  templateUrl: './welt-der-informatik.component.html',
  styleUrls: ['./welt-der-informatik.component.scss']
})
export class WeltDerInformatikComponent extends AbstractRoom {

  constructor(@Inject(DataService) protected readonly dataService: DataService,
              @Inject(ProgressService) protected readonly progressService: ProgressService,
              @Inject(ModalService) protected readonly modalService: ModalService,
              @Inject(Renderer2) protected readonly renderer: Renderer2) {
    super(dataService, progressService, modalService, renderer);
  }

  public ngOnInit(): void {
    super.ngOnInit();
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
    this.walkTo('marie', () => this.openQuestion('room1key', '/assets/sprites/Room/1-welt-der-informatik/Marie.svg'))
  }
}
