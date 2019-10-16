import {QuestionModel} from './question.model';

export class RoomModel {
  public level: number;
  public roomClass: string;
  public feedback: number;
  public mandatoryQuestion: QuestionModel;
  public optionalQuestions: QuestionModel[];
}
