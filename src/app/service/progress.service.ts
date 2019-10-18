import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ProgressModel} from '../model/user/progress.model';
import {PlayedLevelModel} from '../model/user/played-level.model';
import {RoomModel} from '../model/game/room.model';
import * as _ from 'lodash';

class AsyncLocalStorage {
  public static setItem(key, value): Promise<void> {
    return Promise.resolve().then(() => localStorage.setItem(key, value));
  }

  public static getItem(key): Promise<string | null> {
    return Promise.resolve().then(() => localStorage.getItem(key));
  }

  public static clearItem(key: string): Promise<void> {
    return Promise.resolve().then(() => localStorage.removeItem(key));
  }
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  public progress$: Observable<ProgressModel>;

  private progressSource: BehaviorSubject<ProgressModel> = new BehaviorSubject(undefined);

  constructor() {
    this.progress$ = this.progressSource.asObservable();

    this.loadProgress().then(progress => this.progressSource.next(progress));
    this.progress$.subscribe((progress) => this.saveProgress(progress));
  }

  public updateProgress(progress: ProgressModel): void {
    this.progressSource.next(progress);
  }

  public unlockLevel(level: number): void {
    const progress = this.progress;
    const playedLevel = new PlayedLevelModel();
    playedLevel.level = level;
    playedLevel.coins = [];
    playedLevel.roomFeedback = 0;
    playedLevel.hasAlreadyBeenSeen = false;
    progress.unlockedLevel = level;
    progress.playedLevels.set(level, playedLevel);
    this.updateProgress(progress);
  }

  public getLevel(level: number): PlayedLevelModel {
    if (this.isUnlocked(level)) {
      return this.progress.playedLevels.get(level);
    }
  }

  public isUnlocked(level: number): boolean {
    return this.progress.playedLevels.has(level);
  }

  public updateLevelModel(levelModel: PlayedLevelModel): void {
    const progress = this.progress;
    progress.playedLevels.set(levelModel.level, levelModel);
    this.updateProgress(progress);
  }

  public mandatoryQuestionForRoomIsAnswered(room: RoomModel): boolean {
    const progress = this.progress;
    const levelModel = progress.playedLevels.get(room.level);
    return levelModel.key;
  }

  public init(avatarType: string): void {
    const initialProgress = this.createProgressData(avatarType);
    this.progressSource.next(initialProgress);
    AsyncLocalStorage.setItem('progress', JSON.stringify(initialProgress));
  }

  public saveProgress(progress: ProgressModel): Promise<void> {
    const shallowCopy: any = _.cloneDeep(progress);

    if (shallowCopy && shallowCopy.playedLevels) {
      shallowCopy.playedLevels = Array.from(shallowCopy.playedLevels.entries());
      shallowCopy.playedLevels = Array.from(shallowCopy.playedLevels);
      shallowCopy.feedbackAnswers = Array.from(shallowCopy.feedbackAnswers);
    }
    if (shallowCopy) {
      return AsyncLocalStorage.setItem('progress', JSON.stringify(shallowCopy));
    } else {
      return AsyncLocalStorage.clearItem('progress');
    }
  }

  private createProgressData(avatarType): ProgressModel {
    const progress: ProgressModel = new ProgressModel();
    progress.coinsBereitsEingeloest = false;
    progress.numberOfCollectedCoins = 0;
    progress.playedLevels = new Map();
    progress.unlockedLevel = 1;
    progress.avatarType = avatarType;
    progress.avatarPos = 0;
    progress.feedbackAnswers = new Map();

    const level1: PlayedLevelModel = new PlayedLevelModel();
    level1.level = 1;
    level1.coins = [];
    level1.roomFeedback = 0;
    level1.hasAlreadyBeenSeen = true;
    progress.playedLevels.set(level1.level, level1);

    return progress;
  }

  private get progress(): ProgressModel {
    return this.progressSource.getValue();
  }

  private loadProgress(): Promise<ProgressModel> {

    return AsyncLocalStorage.getItem('progress').then((value) => {
      if (value && value !== 'undefined') {
        const partiallyDeserialized = JSON.parse(value);
        partiallyDeserialized.playedLevels = new Map(partiallyDeserialized.playedLevels);
        partiallyDeserialized.feedbackAnswers = new Map(partiallyDeserialized.feedbackAnswers);
        return partiallyDeserialized;
      }
      return undefined;
    });
  }
}
