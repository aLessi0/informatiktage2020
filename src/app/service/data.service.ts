import {Injectable} from '@angular/core';
import {GameModel} from "../model/game/game.model";
import {RoomModel} from "../model/game/room.model";
import {AttachmentModel} from "../model/game/attachment.model";
import {QuestionModel} from "../model/game/question.model";
import {ProgressModel} from "../model/user/progress.model";
import {BehaviorSubject, Observable, Subject} from "rxjs";

class AsyncLocalStorage {
  public static setItem(key, value): Promise<void> {
    return Promise.resolve().then(() => localStorage.setItem(key, value));
  }

  public static getItem(key): Promise<string | null> {
    return Promise.resolve().then(() => localStorage.getItem(key));
  }
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public activeRoom$: Observable<RoomModel>;
  public game$: Observable<GameModel>;
  public progress$: Observable<ProgressModel>;

  private activeRoomSubject: BehaviorSubject<RoomModel> = new BehaviorSubject(undefined);
  private gameSource: BehaviorSubject<GameModel> = new BehaviorSubject(undefined);
  private progressSource: BehaviorSubject<ProgressModel> = new BehaviorSubject(undefined);

  private activeRoomSubject: BehaviorSubject<RoomModel> = new BehaviorSubject(undefined);
  private gameSource: BehaviorSubject<GameModel> = new BehaviorSubject(DataService.createGameData());

  constructor() {
    this.game$ = this.gameSource.asObservable();
    this.activeRoom$ = this.activeRoomSubject.asObservable();
    this.progress$ = this.progressSource.asObservable();

    this.loadGame().then(game => this.gameSource.next(game));
    this.loadProgress().then(progress => this.progressSource.next(progress));
  }

  public activateRoom(room: RoomModel): void {
    this.activeRoomSubject.next(room);
  }

  public leaveActiveRoom(): void {
    this.activeRoomSubject.next(undefined);
  }

  /* notify all subscriber if the progress was updated by ref*/
  public progressUpdated(): void {
    this.progressSource.next(this.progressSource.getValue());
  }

  /*
  *  since we mutate the object byRef, the values are updated everywhere. However, we notify
  * each subscriber to give the possibilty to react to changes.
  */
  public activeRoomUpdated(): void {
    this.activeRoomSubject.next(this.activeRoomSubject.getValue());
  }

  /* informs subscriber of a gameModel change (room value updated, coins reward etc */
  public roomUpdated() {
    this.gameSource.next(this.gameSource.getValue());
  }

  public answeredMandatoryQuestion(activeRoom: RoomModel, question: QuestionModel) {
    question.isCorrect = question.clientAnswer && question.clientAnswer.toLocaleLowerCase() === question.correctAnswer.toLocaleLowerCase();

    /* only valid if the key hasn't been collected yet */
    if (question.isCorrect && !activeRoom.keyCollected) {
      question.answered = true;
      activeRoom.keyCollected = true;
      this.roomUpdated();
      this.activeRoomUpdated();
      this.unlockNextRoom();
    }

  }

  public answeredOptionQuestion(activeRoom: RoomModel, question: QuestionModel) {
    question.isCorrect = question.clientAnswer && question.clientAnswer.toLocaleLowerCase() === question.correctAnswer.toLocaleLowerCase();

    /* coins are only rewarded if the question hasn't been answered yet */
    if (!question.answered && question.isCorrect) {
      const progress = this.progressSource.getValue();
      progress.coins++;
      question.answered = true;
      activeRoom.coinsCollected++;
      this.progressUpdated();
      this.roomUpdated();
      this.activeRoomUpdated();
    }
  }

  public unlockNextRoom(): void {
    const progress = this.progressSource.getValue();
    progress.unlockedLevel++;
    this.progressUpdated();
  }

  public saveProgress(progress: ProgressModel): Promise<void> {
    console.log('SAVE');
    return AsyncLocalStorage.setItem('progress', JSON.stringify(progress));
  }

  public initData(avatarType: string): Promise<void> {
    const game: GameModel = DataService.createGameData();
    this.gameSource.next(game);
    const progress: ProgressModel = DataService.createProgressData(avatarType);
    this.progressSource.next(progress);
    return AsyncLocalStorage.setItem('game', JSON.stringify(game)).then(() => AsyncLocalStorage.setItem('progress', JSON.stringify(progress)));
  }

  private loadProgress(): Promise<ProgressModel> {
    return AsyncLocalStorage.getItem('progress').then((value) => value && JSON.parse(value));
  }

  private loadGame(): Promise<GameModel> {
    return AsyncLocalStorage.getItem('game').then((value) => value && JSON.parse(value));

  }

  private static createProgressData(avatarType): ProgressModel {
    const progress: ProgressModel = new ProgressModel();
    progress.collectedReward = false;
    progress.coins = 0;
    progress.playedLevels = [];
    progress.unlockedLevel = 1;
    progress.avatarType = avatarType;
    progress.avatarPos = 1;

    return progress;
  }

  private static createGameData(): GameModel {
    const game: GameModel = new GameModel();
    game.minCoinsRewardBig = 10;
    game.minCoinsRewardSmall = 6;
    game.rooms = [];

    // ----- RAUM: Requirements and Design -----
    const room1: RoomModel = new RoomModel();
    room1.level = 1;
    room1.name = 'Requirements & Design';
    room1.logo = '/assets/sprites/Icon/Idea.svg';
    room1.color = 'yellow';
    room1.intro = 'In diesem Raum geht es um Requirements und Design!';
    room1.attachments = [];
    room1.questions = [];
    room1.coinsCollected = 0;

    const room1Attachment1: AttachmentModel = new AttachmentModel();
    room1Attachment1.file = 'url to path';
    room1Attachment1.name = 'FILE 11';
    room1.attachments.push(room1Attachment1);

    const room1Question1: QuestionModel = new QuestionModel();
    room1Question1.number = 1;
    room1Question1.questionText = 'Dies ist die Mandatory-Frage. Was bekommt man wenn man bei Requirements "Require" rausnimmt?';
    room1Question1.correctAnswer = 'ments';
    const room1Question2: QuestionModel = new QuestionModel();
    room1Question2.number = 2;
    room1Question2.questionText = 'Dies ist eine Optional-Frage. Was gibt 1+1?';
    room1Question2.correctAnswer = '2';
    const room1Question3: QuestionModel = new QuestionModel();
    room1Question3.number = 3;
    room1Question3.questionText = 'Was beduetet IT?';
    room1Question3.correctAnswer = 'Information Technology';

    room1.questions.push(room1Question1, room1Question2, room1Question3);

    // ----- RAUM: Entwicklung & Test -----
    const room2: RoomModel = new RoomModel();
    room2.level = 2;
    room2.name = 'Entwicklung & Test';
    room2.logo = 'url to logo';
    room2.color = 'blue';
    room2.intro = 'In diesem Raum geht es um Entwicklung und TEst!';
    room2.attachments = [];
    room2.questions = [];
    room2.coinsCollected = 0;

    const room2Attachment1: AttachmentModel = new AttachmentModel();
    room2Attachment1.file = 'url to path';
    room2Attachment1.name = 'FILE 12';
    room2.attachments.push(room2Attachment1);

    const room2Question1: QuestionModel = new QuestionModel();
    room2Question1.number = 1;
    room2Question1.questionText = 'Dies ist die Mandatory-Frage. Was bekommt man wenn man bei Entwicklung "Ent" rausnimmt?';
    room2Question1.correctAnswer = 'wicklung';
    const room2Question2: QuestionModel = new QuestionModel();
    room2Question2.number = 2;
    room2Question2.questionText = 'Dies ist eine Optional-Frage. Was gibt 2+2?';
    room2Question2.correctAnswer = '4';
    const room2Question3: QuestionModel = new QuestionModel();
    room2Question3.number = 3;
    room2Question2.questionText = 'Dies ist eine Optional-Frage. Was gibt 22+22?';
    room2Question3.correctAnswer = '44';

    room2.questions.push(room2Question1, room2Question2, room2Question3);

    // ----- RAUM: Build, Deployment & Operate -----
    const room3: RoomModel = new RoomModel();
    room3.level = 3;
    room3.name = 'Build, Deployment & Operate';
    room3.logo = 'url to logo';
    room3.color = 'red';
    room3.intro = 'In diesem Raum geht es um Build, Deployment & Operate!';
    room3.attachments = [];
    room3.questions = [];
    room3.coinsCollected = 0;

    const room3Attachment1: AttachmentModel = new AttachmentModel();
    room3Attachment1.file = 'url to path';
    room3Attachment1.name = 'FILE 13';
    room3.attachments.push(room3Attachment1);

    const room3Question1: QuestionModel = new QuestionModel();
    room3Question1.number = 1;
    room3Question1.questionText = 'Dies ist die Mandatory-Frage. Was bekommt man wenn man bei Build "Bu" rausnimmt?';
    room3Question1.correctAnswer = 'ild';
    const room3Question2: QuestionModel = new QuestionModel();
    room3Question2.number = 2;
    room3Question2.questionText = 'Dies ist eine Optional-Frage. Was gibt 3+3?';
    room3Question2.correctAnswer = '6';
    const room3Question3: QuestionModel = new QuestionModel();
    room3Question3.number = 3;
    room3Question2.questionText = 'Dies ist eine Optional-Frage. Was gibt 33+33?';
    room3Question3.correctAnswer = '66';

    room3.questions.push(room3Question1, room3Question2, room3Question3);

    game.rooms.push(room1, room2, room3);

    return game;
  }
}
