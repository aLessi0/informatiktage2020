import {Component, ElementRef, Inject, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {DataService} from '../../service/data.service';
import {GameModel} from '../../model/game/game.model';
import {ProgressModel} from '../../model/user/progress.model';
import {RoomModel} from '../../model/game/room.model';
import {ModalService} from '../../service/modal.service';
import {RewardCoinsComponent} from '../base/reward-coins/reward-coins.component';
import {QuizfrageComponent, QuizfrageData} from "../base/quizfrage/quizfrage.component";
import {QuestionModel} from "../../model/game/question.model";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input() public game: GameModel;
  @Input() public progress: ProgressModel;

  @ViewChild('person', {read: ElementRef}) personRef: ElementRef<HTMLElement>;

  public numberOfCoinsInGame: number;

  private isWalking: boolean = false;

  constructor(@Inject(DataService) private readonly dataService: DataService,
              @Inject(Renderer2) private readonly renderer: Renderer2,
              @Inject(ModalService) protected readonly modalService: ModalService) {

  }

  public ngOnInit(): void {
    let coinsInGame = 0;
    for (const room of this.game.rooms) {
      coinsInGame += (room.questions.length - 1);
    }
    this.numberOfCoinsInGame = coinsInGame;
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

  public collectedReward(): void {
    this.modalService.openDialog(RewardCoinsComponent, false, true).subscribe(() => {
    });
  }

  public isRoomUnlocked(roomNumber: number): boolean {
    const room = this.getRoomByNumber(roomNumber);
    return room && room.level <= this.progress.unlockedLevel;
  }

  public getRoomClass(roomNumber: number): string {
    const room = this.getRoomByNumber(roomNumber);
    return room && room.roomClass;
  }


  private getRoomByNumber(roomNumber: number): RoomModel {
    return this.game.rooms[roomNumber];
  }
}
