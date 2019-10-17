import {PlayedLevelModel} from './played-level.model';
import {ContestModel} from './contest.model';

export class ProgressModel {
  public avatarType: string;
  public avatarPos: number;
  public unlockedLevel: number;
  public numberOfCollectedCoins: number;
  public coinsBereitsEingeloest: boolean;
  public playedLevels: Map<number, PlayedLevelModel>;
  public contest: ContestModel;
}
