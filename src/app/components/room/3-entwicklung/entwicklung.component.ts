import {Component, Inject} from '@angular/core';
import {AbstractRoom} from '../abstract-room';
import {DataService} from '../../../service/data.service';
import {ModalService} from '../../../service/modal.service';

@Component({
  selector: 'app-entwicklung',
  templateUrl: './entwicklung.component.html',
  styleUrls: ['./entwicklung.component.scss']
})
export class EntwicklungComponent extends AbstractRoom {

  constructor(@Inject(DataService) protected readonly dataService: DataService,
              @Inject(ModalService) protected readonly modalService: ModalService) {
    super(dataService, modalService);
  }

  private planetRewardCollected: boolean = false;
  private planetState: number = 0;

  private starRewardCollected: boolean = false;
  private starsHidden = [];

  planetClick() {
    console.log(this.planetState);
    if ( this.planetRewardCollected ) {
      return;
    }

    this.planetState++;

    if (this.planetState >= 3) {
      this.openQuestion(this.room.optionalQuestions[0]);
      this.planetRewardCollected = true;
    }
  }

  starClick(id) {
    console.log(id);
    if ( !this.isStarHidden(id) ) {
      this.starsHidden.push(id);
    }

    //check reward
    if ( this.starsHidden.length == 4 &&  !this.starRewardCollected ) {
      // @TODO: coin reward
      console.log('COIN!');
    }
    console.log(this.starsHidden)
  }

  isStarHidden(id) {
    if ( this.starsHidden.indexOf(id) !== -1) {
      return true;
    }
    return false;
  }

}
