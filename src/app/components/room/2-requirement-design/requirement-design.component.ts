import {Component, Inject} from '@angular/core';
import {AbstractRoom} from '../abstract-room';
import {DataService} from '../../../service/data.service';
import {ModalService} from '../../../service/modal.service';
import {ProgressService} from '../../../service/progress.service';

@Component({
  selector: 'app-requirement-design',
  templateUrl: './requirement-design.component.html',
  styleUrls: ['./requirement-design.component.scss']
})
export class RequirementDesignComponent extends AbstractRoom {

  ueliHidden = true;
  counter: number = 0;

  constructor(@Inject(DataService) protected readonly dataService: DataService,
              @Inject(ProgressService) protected readonly progressService: ProgressService,
              @Inject(ModalService) protected readonly modalService: ModalService) {
    super(dataService, progressService, modalService);
  }

  public ueliVisible() {
    this.counter = this.counter + 1;
    if (this.counter >= 2) {
      this.ueliHidden = false;
    }
  }

}
