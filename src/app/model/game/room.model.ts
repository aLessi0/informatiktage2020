import {QuestionModel} from './question.model';
import {InfoModel} from './info.model';

export class RoomModel {
  public level: number;
  public name: string;
  public roomClass: string;
  public feedback: number;
  public questions: QuestionModel[];
  public infos: InfoModel[];
  public numberOfCoinsInRoom: number;
}
