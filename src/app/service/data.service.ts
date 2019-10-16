import {Inject, Injectable} from '@angular/core';
import {GameModel} from '../model/game/game.model';
import {RoomModel} from '../model/game/room.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {ProgressService} from './progress.service';
import {HttpClient} from '@angular/common/http';

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

  private activeRoomSubject: BehaviorSubject<RoomModel> = new BehaviorSubject(undefined);
  private gameSource: BehaviorSubject<GameModel> = new BehaviorSubject(undefined);

  constructor(@Inject(ProgressService) private readonly progressService: ProgressService,
              private http: HttpClient) {
    this.game$ = this.gameSource.asObservable();
    this.activeRoom$ = this.activeRoomSubject.asObservable();

    this.loadGame().then(game => this.gameSource.next(game));
  }

  public activateRoom(room: RoomModel): void {
    this.activeRoomSubject.next(room);
  }

  public leaveActiveRoom(): void {
    this.activeRoomSubject.next(undefined);
  }

  public initData(avatarType: string): void {
    this.http.get('assets/data/gamedata.json')
      .subscribe(data => {
        const game: GameModel = data as GameModel;
        for (const room of game.rooms) {
          room.mandatoryQuestion.isMandatory = true;
        }
        this.gameSource.next(game);
        this.progressService.init(avatarType);
        return AsyncLocalStorage.setItem('game', JSON.stringify(game));
      });
  }

  private loadGame(): Promise<GameModel> {
    return AsyncLocalStorage.getItem('game').then((value) => value && JSON.parse(value));

  }
}
