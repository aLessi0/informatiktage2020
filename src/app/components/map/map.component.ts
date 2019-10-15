import {Component, Inject, Input, OnInit} from '@angular/core';
import {DataService} from '../../service/data.service';
import {GameModel} from '../../model/game/game.model';
import {ProgressModel} from '../../model/user/progress.model';
import {RoomModel} from '../../model/game/room.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input() public game: GameModel;
  @Input() public progress: ProgressModel;

  public numberOfCoinsInGame: number;

  constructor(@Inject(DataService) private readonly dataService: DataService) {

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
      let room = this.getRoomByNumber(roomNumber);
      this.progress.avatarPos = room.level;
      this.dataService.activateRoom(room);
    }
  }

  public isRoomUnlocked(roomNumber: number): boolean {
    const room = this.getRoomByNumber(roomNumber);
    return room && room.level <= this.progress.unlockedLevel;
  }

  public getRoomClass(roomNumber: number): string {
    let room = this.getRoomByNumber(roomNumber);
    return room && room.roomClass;
  }


  private getRoomByNumber(roomNumber: number): RoomModel {
    return this.game.rooms[roomNumber];
  }
}
