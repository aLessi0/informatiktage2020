import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {RoomModel} from '../../model/game/room.model';
import {FeedbackComponent} from '../modal/feedback/feedback.component';
import {ModalService} from '../../service/modal.service';
import {ProgressModel} from '../../model/user/progress.model';
import {PlayedLevelModel} from '../../model/user/played-level.model';
import {ProgressService} from '../../service/progress.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-room-container',
  templateUrl: './room-container.component.html',
  styleUrls: ['./room-container.component.scss']
})
export class RoomContainerComponent implements OnInit {
  @Input() public room: RoomModel;
  @Output() private closeRoom: EventEmitter<void> = new EventEmitter();

  private mandatoryQuestionWasAnsweredOnEntry: boolean;
  public progress: ProgressModel;
  public level: PlayedLevelModel;
  public streetUrl: SafeResourceUrl;

  constructor(@Inject(ModalService) private readonly modalService: ModalService,
              @Inject(ProgressService) private readonly progressService: ProgressService,
              @Inject(DomSanitizer) private readonly sanitizer: DomSanitizer) {
    this.progressService.progress$.subscribe((progress) => {
      this.progress = progress;
      if (this.progress) {
        if (this.room) {
          this.level = this.progress.playedLevels.get(this.room.level);
        }
      }
    });
  }

  public ngOnInit(): void {
    if (this.progress) {
      if (this.room) {
        this.level = this.progress.playedLevels.get(this.room.level);
      }
    }
    this.mandatoryQuestionWasAnsweredOnEntry = this.progressService.mandatoryQuestionForRoomIsAnswered(this.room);

    this.streetUrl = this.getStreetUrl();
  }

  public onStreetMapTap(): void {
    if (!this.level.roomFeedback && !this.mandatoryQuestionWasAnsweredOnEntry &&
      this.progressService.mandatoryQuestionForRoomIsAnswered(this.room)) {

      this.modalService.openDialog(FeedbackComponent, true).subscribe(() => this.closeRoom.emit());
    } else {
      this.closeRoom.emit();
    }

  }

  private getStreetUrl(): SafeResourceUrl {
      return this.sanitizer.bypassSecurityTrustResourceUrl('/assets/sprites/Icon/Room/Street-Room-' + this.room.level + '.svg');
  }
}
