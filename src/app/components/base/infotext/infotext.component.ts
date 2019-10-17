import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {ModalService} from '../../../service/modal.service';

@Component({
  selector: 'app-infotext',
  templateUrl: './infotext.component.html',
  styleUrls: ['./infotext.component.scss']
})
export class InfotextComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: InfotextData,
              @Inject(ModalService) private readonly modalService: ModalService) {
  }

  public closeInfo(): void {
    this.modalService.closeDialog();
  }

}

export interface InfotextData {
  text: string;
  icon: string;
  isReward: boolean;
}
