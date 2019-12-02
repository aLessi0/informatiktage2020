import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {ModalService} from '../../../service/modal.service';
import {TypewriterUtils} from '../../../utils/typewriter.utils';

@Component({
  selector: 'app-infotext',
  templateUrl: './infotext.component.html',
  styleUrls: ['./infotext.component.scss']
})
export class InfotextComponent implements OnInit {
  public showButton;
  @ViewChild('infotext') private textDiv: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: InfotextData,
              @Inject(ModalService) private readonly modalService: ModalService) {
  }

  public ngOnInit(): void {
    if (this.data.text) {
      TypewriterUtils.typewrite(this.textDiv.nativeElement, this.data.text).then(() => {
        setTimeout(() => this.showButton = true, 500);
      });
    }
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
