import {
  Component,
  DoCheck,
  ElementRef,
  Inject,
  KeyValueDiffer,
  KeyValueDiffers,
  NgZone,
  Renderer2,
  ViewChild
} from '@angular/core';
import {DataService} from './service/data.service';
import {ProgressModel} from './model/user/progress.model';
import {DebounceUtils} from './utils/debounce.utils';
import {HttpClient} from '@angular/common/http';
import {RoomModel} from './model/game/room.model';
import {GameModel} from './model/game/game.model';
import {ProgressService} from './service/progress.service';
import {animation} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements DoCheck {
  public progressAvailable = false;
  public progress: ProgressModel;
  public game: GameModel;
  public currentRoom: RoomModel;

  @ViewChild('animationPanel', {read: ElementRef}) public animationPanelRef: ElementRef;

  private readonly differ: KeyValueDiffer<string, string>;

  private debounceCheckForSave: (...args: any[]) => void;

  constructor(@Inject(DataService) private readonly dataService: DataService,
              @Inject(NgZone) private readonly ngZone: NgZone,
              @Inject(KeyValueDiffers) readonly differs: KeyValueDiffers,
              @Inject(HttpClient) private readonly http: HttpClient,
              @Inject(ProgressService) private readonly progressService: ProgressService,
              @Inject(Renderer2) private readonly renderer: Renderer2) {
    this.differ = differs.find([]).create();

    this.dataService.game$.subscribe(game => {
      this.game = game;
    });

    this.dataService.activeRoom$.subscribe(activeRoom => {
      if (this.currentRoom !== activeRoom) {
        this.renderer.addClass(this.animationPanelRef.nativeElement, 'animation');
        let animationCounter = 0;
        this.animationPanelRef.nativeElement.addEventListener('animationend', () => {
          animationCounter++;
          if (animationCounter === 1) {
            this.currentRoom = activeRoom;
          } else if (animationCounter === 2) {
            this.renderer.removeClass(this.animationPanelRef.nativeElement, 'animation');
          }
        });
      }
    });

    this.progressService.progress$.subscribe(progress => {
      this.progressAvailable = !!progress;
      this.progress = progress;
    });
  }

  public leaveActiveRoom(): void {
    this.dataService.leaveActiveRoom();
  }

  public ngDoCheck() {
    this.ngZone.runOutsideAngular(() => {
      this.checkForSave();
    });
  }

  private checkForSave(): void {
    if (!this.debounceCheckForSave) {
      this.debounceCheckForSave = DebounceUtils.debounce(() => {
        if (this.progressAvailable) {
          const changes = this.differ.diff(this.getDiffObject());
          if (changes) {
            this.progressService.saveProgress(this.progress);
          }
        }
      }, 1000, false);
    }
    this.debounceCheckForSave();
  }

  private getDiffObject(): {} {
    return {object: JSON.stringify(this.progress)};
  }
}
