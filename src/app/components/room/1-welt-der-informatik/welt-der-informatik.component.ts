import {Component, Inject} from '@angular/core';
import {DataService} from '../../../service/data.service';
import {ModalService} from '../../../service/modal.service';
import {AbstractRoom} from '../abstract-room';

@Component({
  selector: 'app-welt-der-informatik',
  templateUrl: './welt-der-informatik.component.html',
  styleUrls: ['./welt-der-informatik.component.scss']
})
export class WeltDerInformatikComponent extends AbstractRoom {

  constructor(@Inject(DataService) protected readonly dataService: DataService,
              @Inject(ModalService) protected readonly modalService: ModalService) {
    super(dataService, modalService);
  }

  public onRetoTab()  {
    if (true) { // this.level.key - Check if key is already set
      this.openInfoModal(); // Text hinzufügen mit Hier ein Coin.
      // Give him the coin something like this.level.coin = true;
    } else { // Show question if key is already collected
      this.openInfoModal(); // Text hinzufügen gehe zu meiner Kollegin und komm später wieder
    }
  }
}
