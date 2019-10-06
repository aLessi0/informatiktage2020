import {Component, DoCheck, Inject, KeyValueDiffer, KeyValueDiffers, NgZone} from '@angular/core';
import {DataService} from "./service/data.service";
import {ProgressModel} from "./model/user/progress.model";
import {PlayedLevelModel} from "./model/user/played-level.model";
import {AnswerModel} from "./model/user/answer.model";
import {DebounceUtils} from "./utils/debounce.utils";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements DoCheck {
  public progressAvailable: boolean = false;
  public loadingProgress: boolean = true;
  public progress: ProgressModel;

  private readonly differ: KeyValueDiffer<string, string>;

  private debounceCheckForSave: Function;

  // -- START TEST - REMOVE THIS SHIT
  private number = 0;
  private checked: boolean = false;
  // -- END TEST - REMOVE THIS SHIT

  constructor(@Inject(DataService) private readonly dataService: DataService,
              @Inject(NgZone) private readonly ngZone: NgZone,
              @Inject(KeyValueDiffers) readonly differs: KeyValueDiffers) {
    this.differ = differs.find([]).create();
    this.loadProgress();
  }

  public ngDoCheck() {
    this.ngZone.runOutsideAngular(() => {
      this.checkForSave();
    });
  }

  public startGame(): void {
    this.dataService.initData().then(() => {
      this.loadProgress();
    });
  }

  private loadProgress(): void {
    this.loadingProgress = true;
    this.dataService.loadProgress().then((progress: ProgressModel) => {
      this.loadingProgress = false;
      this.progressAvailable = !!progress;
      this.progress = progress;
      this.differ.diff(this.getDiffObject());
    });
  }

  private checkForSave(): void {
    if (!this.debounceCheckForSave) {
      this.debounceCheckForSave = DebounceUtils.debounce(() => {
        if (this.progressAvailable && !this.loadingProgress) {
          console.log("CHECK");
          const changes = this.differ.diff(this.getDiffObject());
          if (changes) {
            this.dataService.saveProgress(this.progress);
          }
        }
      }, 1000, false);
    }
    this.debounceCheckForSave();
  }

  private getDiffObject(): {} {
    return {object: JSON.stringify(this.progress)};
  }

  // -- START TEST - REMOVE THIS SHIT
  public change(): void {
    switch (this.number) {
      case 0:
        this.progress.playedLevels.push(new PlayedLevelModel());
        break;
      case 1:
        this.progress.playedLevels[0].level = 1;
        break;
      case 2:
        this.progress.playedLevels[0].answers = [];
        break;
      case 3:
        this.progress.playedLevels[0].answers.push(new AnswerModel());
        break;
      case 4:
        this.progress.playedLevels[0].answers[0].number = 1;
        break;
      case 5:
        this.progress.playedLevels[0].answers[0].answer = 'hallo';
        break;
      default:
        this.progress.playedLevels.push(new PlayedLevelModel());
    }
    this.number++;
  }
  // -- END TEST - REMOVE THIS SHIT
}
