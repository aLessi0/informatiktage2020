import {Component, Inject} from '@angular/core';
import {AbstractRoom} from '../abstract-room';
import {DataService} from '../../../service/data.service';
import {ModalService} from '../../../service/modal.service';
import {ProgressService} from '../../../service/progress.service';
import {FeedbackInformatiktageComponent} from '../../base/feedback/feedback-informatiktage.component';

@Component({
  selector: 'app-recruiting',
  templateUrl: './recruiting.component.html',
  styleUrls: ['./recruiting.component.scss']
})
export class RecruitingComponent extends AbstractRoom {

  constructor(@Inject(DataService) protected readonly dataService: DataService,
              @Inject(ProgressService) protected readonly progressService: ProgressService,
              @Inject(ModalService) protected readonly modalService: ModalService) {
    super(dataService, progressService, modalService);
  }

  public doFinish(): void {
    if ( !this.level.key ) {
      this.openInfo('room5finishText', '/assets/sprites/Room/1-welt-der-informatik/Reto.svg', () => {
        this.openITDFeedback();
      });
    } else {
      this.openInfo('room5feedbackDanke', '/assets/sprites/Room/1-welt-der-informatik/Reto.svg');
    }
  }

  public openITDFeedback(): void {
    if(!this.progress.feedbackCompleted) {
      this.modalService.openDialog(FeedbackInformatiktageComponent, false).subscribe(() => {
        if(this.progress.feedbackCompleted) {
          this.unlockPlayground();
        }
      });
    }
  }

  public unlockPlayground(): void {
    this.level.key = true;
    this.progressService.unlockLevel(this.level.level + 1);
    this.openReward(true);
  }

}
