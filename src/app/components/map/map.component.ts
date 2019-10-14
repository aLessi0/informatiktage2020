import {Component, Inject, Input} from '@angular/core';
import {DataService} from "../../service/data.service";
import {GameModel} from "../../model/game/game.model";
import {ProgressModel} from "../../model/user/progress.model";
import {RoomModel} from "../../model/game/room.model";

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
    this.dataService.activateRoom(this.getRoomByNumber(roomNumber));
  }

  private getRoomByNumber(roomNumber: number): RoomModel {
    return this.game.rooms[roomNumber];
  }
}
