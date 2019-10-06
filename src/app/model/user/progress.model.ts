import {PlayedLevelModel} from "./played-level.model";
import {ContestModel} from "./contest.model";

export class ProgressModel {
  public nickname: string;
  public avatarType: number;
  public unlockedLevel: number;
  public avatarPos: number;
  public coins: number;
  public collectedReward: boolean;
  public playedLevels: PlayedLevelModel[];
  public contest: ContestModel;
}
