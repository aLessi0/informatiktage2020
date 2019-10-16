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

}
