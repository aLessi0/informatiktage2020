import {Component, Inject, Input} from '@angular/core';
import {DataService} from '../../service/data.service';
import {GameModel} from '../../model/game/game.model';
import {ProgressModel} from '../../model/user/progress.model';
import {RoomModel} from '../../model/game/room.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  @Input() public game: GameModel;
  @Input() public progress: ProgressModel;

  constructor(@Inject(DataService) private readonly dataService: DataService) {
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
