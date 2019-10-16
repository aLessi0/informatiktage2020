import {PlayedLevelModel} from './played-level.model';
import {ContestModel} from './contest.model';
import {FeedbackAnswer} from './feedback-answer.model';

export class ProgressModel {
  public avatarType: string;
  public avatarPos: number;
  public unlockedLevel: number;
  public coins: number;
  public collectedReward: boolean;
  public feedbackAnswers: Map<number, FeedbackAnswer>;
  public playedLevels: Map<number, PlayedLevelModel>;
  public contest: ContestModel;
  public canTakePartInContest: boolean;
  public takesPartInContest: boolean;
}
