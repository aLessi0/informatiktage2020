import {Component, Inject} from '@angular/core';
import {AbstractRoom} from '../abstract-room';
import {DataService} from '../../../service/data.service';
import {ModalService} from '../../../service/modal.service';

@Component({
  selector: 'app-build-deploy',
  templateUrl: './build-deploy.component.html',
  styleUrls: ['./build-deploy.component.scss']
})
export class BuildDeployComponent extends AbstractRoom {

  constructor(@Inject(DataService) protected readonly dataService: DataService,
              @Inject(ModalService) protected readonly modalService: ModalService) {
    super(dataService, modalService);
  }

}
