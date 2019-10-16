import {RoomModel} from './room.model';
import {FeedbackModel} from './feedback.model';

export class GameModel {
  public minCoinsRewardSmall: number;
  public minCoinsRewardBig: number;
  public rooms: RoomModel[];
  public feedback: FeedbackModel[];
}
