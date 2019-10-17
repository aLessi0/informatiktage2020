import {QuestionModel} from './question.model';
import {InfoModel} from './info.model';

export class RoomModel {
  public level: number;
  public roomClass: string;
  public questions: QuestionModel[];
  public infos: InfoModel[];
  public numberOfCoinsInRoom: number;
}
