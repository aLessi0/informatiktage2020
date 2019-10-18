import {AfterViewInit, Component, ElementRef, Inject, Input, NgZone, Renderer2, ViewChild} from '@angular/core';
import {DataService} from '../../service/data.service';
import {GameModel} from '../../model/game/game.model';
import {ProgressModel} from '../../model/user/progress.model';
import {RoomModel} from '../../model/game/room.model';
import {ModalService} from '../../service/modal.service';
import {RewardCoinsComponent} from '../base/reward-coins/reward-coins.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

  @Input() public game: GameModel;
  @Input() public progress: ProgressModel;

  @ViewChild('person', {read: ElementRef}) personRef: ElementRef<HTMLElement>;
  @ViewChild('room1', {read: ElementRef}) room1Ref: ElementRef<HTMLElement>;
  @ViewChild('room2', {read: ElementRef}) room2Ref: ElementRef<HTMLElement>;
  @ViewChild('room3', {read: ElementRef}) room3Ref: ElementRef<HTMLElement>;
  @ViewChild('room4', {read: ElementRef}) room4Ref: ElementRef<HTMLElement>;
  @ViewChild('room5', {read: ElementRef}) room5Ref: ElementRef<HTMLElement>;
  @ViewChild('room6', {read: ElementRef}) room6Ref: ElementRef<HTMLElement>;

  private isWalking = false;
  private roomActivatingAnimationRunning: boolean;

  constructor(@Inject(DataService) private readonly dataService: DataService,
              @Inject(Renderer2) private readonly renderer: Renderer2,
              @Inject(ModalService) protected readonly modalService: ModalService,
              @Inject(NgZone) protected readonly zone: NgZone) {

  }

  public ngAfterViewInit(): void {
    for (const levelNumber of Array.from(this.progress.playedLevels.keys())) {
      const playedLevel = this.progress.playedLevels.get(levelNumber);
      if (!playedLevel.hasAlreadyBeenSeen) {
        this.roomActivatingAnimationRunning = true;
        const roomRef = this.getRoomRef(playedLevel.level);
        setTimeout(() => {
          this.renderer.addClass(roomRef.nativeElement, 'unlockAnimation');

          let animationCount = 0;
          roomRef.nativeElement.addEventListener('animationend', () => {
            animationCount++;
            if (animationCount === 2) {
              this.zone.run(() => {
                playedLevel.hasAlreadyBeenSeen = true;
              });
            } else if (animationCount === 3) {
              this.renderer.removeClass(roomRef.nativeElement, 'unlockAnimation');
            }
          });
        }, 500);
      }
    }
  }

  public activateRoom(roomNumber: number): void {
    if (this.isRoomUnlocked(roomNumber)) {
      const room = this.getRoomByNumber(roomNumber);

      const startLevel: number = this.progress.avatarPos;
      const endLevel: number = room.level;

      const openRoom = () => {
        this.progress.avatarPos = room.level;
        this.dataService.activateRoom(room);
      };

      if (startLevel === endLevel) {
        openRoom();
      } else {
        const animationClass: string = 'animation' + startLevel + '-' + endLevel;
        this.renderer.addClass(this.personRef.nativeElement, animationClass);
        this.personRef.nativeElement.addEventListener('animationend', () => {
          this.isWalking = false;
          setTimeout(() => {
            if (!this.isWalking) {
              openRoom();
            }
          }, 50);
        });
        this.personRef.nativeElement.addEventListener('animationstart', () => {
          this.isWalking = true;

          this.renderer.removeClass(this.personRef.nativeElement, 'pos' + startLevel);
          this.renderer.addClass(this.personRef.nativeElement, 'pos' + endLevel);
        });
      }
    }
  }

  public coinsEinloesen(): void {
    this.modalService.openDialog(RewardCoinsComponent, false, {
      game: this.game,
      progress: this.progress
    }).subscribe(() => {});
  }

  public isRoomUnlocked(roomNumber: number): boolean {
    const room = this.getRoomByNumber(roomNumber);
    return room && room.level <= this.progress.unlockedLevel && this.hasRoomAlreadyBeenSeen(room.level);
  }

  public getRoomClass(roomNumber: number): string {
    const room = this.getRoomByNumber(roomNumber);
    return room && room.roomClass;
  }

  public getBadgeClass(roomNumber: number) {
    const room = this.getRoomByNumber(roomNumber);
    const roomProgress = this.progress.playedLevels.get(room.level);
    if (roomProgress && room) {
      if (roomProgress.coins.length === room.numberOfCoinsInRoom && roomProgress.key) {
        return 'badge';
      }
    }
    return '';
  }

  private getRoomByNumber(roomNumber: number): RoomModel {
    return this.game.rooms[roomNumber];
  }

  private hasRoomAlreadyBeenSeen(roomNumber: number): boolean {
    return this.progress.playedLevels
      && this.progress.playedLevels.get(roomNumber)
      && this.progress.playedLevels.get(roomNumber).hasAlreadyBeenSeen;
  }

  private getRoomRef(level): ElementRef {
    switch (level) {
      case 1:
        return this.room1Ref;
      case 2:
        return this.room2Ref;
      case 3:
        return this.room3Ref;
      case 4:
        return this.room4Ref;
      case 5:
        return this.room5Ref;
      case 6:
        return this.room6Ref;
    }
  }
}
