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

}
