import {Component, Inject, Renderer2} from '@angular/core';
import {AbstractRoom} from '../abstract-room';
import {DataService} from '../../../service/data.service';
import {ModalService} from '../../../service/modal.service';
import {ProgressService} from '../../../service/progress.service';

@Component({
  selector: 'app-entwicklung',
  templateUrl: './entwicklung.component.html',
  styleUrls: ['./entwicklung.component.scss']
})
export class EntwicklungComponent extends AbstractRoom {

  public planetState = 0;
  public starsHidden = [];

  constructor(@Inject(DataService) protected readonly dataService: DataService,
              @Inject(ProgressService) protected readonly progressService: ProgressService,
              @Inject(ModalService) protected readonly modalService: ModalService,
              @Inject(Renderer2) protected readonly renderer: Renderer2) {
    super(dataService, progressService, modalService, renderer);
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  planetClick() {
    console.log(this.planetState);


    this.planetState++;

    if (this.planetState >= 3) {
      this.openQuestion('room3coin1', '/assets/sprites/Room/3-develop-and-testing/Planet.svg');
    }
  }

  starClick(id) {
    console.log(id);
    if (!this.isStarHidden(id)) {
      this.starsHidden.push(id);
    }

    // check reward
    if (this.starsHidden.length === 4) {
      this.openInfo('room3coin2', '/assets/sprites/Room/3-develop-and-testing/Stars1-gross1.svg');
    }
    console.log(this.starsHidden);
  }

  isStarHidden(id) {
    if (this.starsHidden.indexOf(id) !== -1) {
      return true;
    }
    return false;
  }

}
