import {Component} from '@angular/core';
import {DataService} from '../../../service/data.service';
import {ModalService} from '../../../service/modal.service';
import {RoomModel} from '../../../model/game/room.model';
import {ProgressService} from '../../../service/progress.service';
import {ProgressModel} from '../../../model/user/progress.model';
import {PlayedLevelModel} from '../../../model/user/played-level.model';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent {
  private progress: ProgressModel;
  public room: RoomModel;
  public level: PlayedLevelModel;

  constructor(private dataService: DataService,
              private progressService: ProgressService,
              private modalService: ModalService,
              private http: HttpClient) {

    this.dataService.activeRoom$.subscribe(room => this.room = room);
    this.progressService.progress$.subscribe(progress => {
      this.progress = progress;
      this.level = this.progress.playedLevels.get(this.room.level);
    });
  }

  onFeedbackClick(feedback) {
    this.level.roomFeedback = feedback;
    const afterPost = () => {
      this.progressService.updateProgress(this.progress);
      this.modalService.closeDialog();
    }
    
    this.http.post('/api/feedback/raum', {
      timestamp: new Date().getTime(),
      userId: this.progress.uid,
      roomNumber: this.room.level,
      roomName: this.room.name,
      roomFeedback: this.level.roomFeedback
    }).subscribe(() => afterPost(), () => afterPost());
  }
}
