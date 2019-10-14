import {Component, Inject, OnInit} from '@angular/core';
import {DataService} from '../../service/data.service';
import {RoomModel} from '../../model/game/room.model';

@Component({
  selector: 'app-quiz-room',
  templateUrl: './quiz-room.component.html',
  styleUrls: ['./quiz-room.component.scss']
})
export class QuizRoomComponent implements OnInit {
  public activeRoom: RoomModel;

  constructor(@Inject(DataService) private readonly dataService: DataService) {
    this.dataService.activeRoom$.subscribe((activeRoom) => {
      this.activeRoom = activeRoom;
      console.log(this.activeRoom);
    });
  }

  ngOnInit() {
  }

}


