import {AnswerModel} from './answer.model';

export class PlayedLevelModel {
  public level: number;
  public answers: Map<number, AnswerModel>;
  public coins: number;
  public key: boolean;
}
