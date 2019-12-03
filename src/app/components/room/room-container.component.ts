import {
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  Renderer2
} from '@angular/core';
import {RoomModel} from '../../model/game/room.model';
import {FeedbackComponent} from '../modal/feedback/feedback.component';
import {ModalService} from '../../service/modal.service';
import {ProgressModel} from '../../model/user/progress.model';
import {PlayedLevelModel} from '../../model/user/played-level.model';
import {ProgressService} from '../../service/progress.service';
import {AbstractRoom} from './abstract-room';

@Component({
  selector: 'app-room-container',
  templateUrl: './room-container.component.html',
  styleUrls: ['./room-container.component.scss']
})
export class RoomContainerComponent implements OnInit {
  @Input() public room: RoomModel;
  @Output() private closeRoom: EventEmitter<void> = new EventEmitter();

  private avatarRef: ElementRef;


  @ContentChild('room') private abstractRoom: AbstractRoom;

  private mandatoryQuestionWasAnsweredOnEntry: boolean;
  public progress: ProgressModel;
  public level: PlayedLevelModel;
  public streetUrl: string;

  constructor(@Inject(ModalService) private readonly modalService: ModalService,
              @Inject(Renderer2) private readonly renderer: Renderer2,
              @Inject(ProgressService) private readonly progressService: ProgressService) {
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
    let leaveRoom = () => {
      this.renderer.addClass(this.abstractRoom.avatarRef.nativeElement, 'leaveRoomAnimation');
      let leaveRoomAnimation = () => {
        this.abstractRoom.avatarRef.nativeElement.removeEventListener('animationend', leaveRoomAnimation);
        this.closeRoom.emit();
      };
      this.abstractRoom.avatarRef.nativeElement.addEventListener('animationend', leaveRoomAnimation);
    };


    this.abstractRoom.walkTo('door', () => {
      if (!this.level.roomFeedback && this.level.level < 5 && this.progressService.mandatoryQuestionForRoomIsAnswered(this.room)) {
        this.modalService.openDialog(FeedbackComponent, false).subscribe(() => {
          if (this.level.roomFeedback) {
            leaveRoom();
          }
        });
      } else {
        leaveRoom();
      }
    });
  }

  private getStreetUrl(): string {
    return '/assets/sprites/Icon/Room/Street-Room-' + this.room.level + '.svg';
  }
}
