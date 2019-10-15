import {AttachmentModel} from './attachment.model';
import {QuestionModel} from './question.model';

export class RoomModel {
  public level: number;
  public keyCollected: boolean;
  public coinsCollected: number;
  public name: string;
  public logo: string;
  public roomClass: string;
  public intro: string;
  public attachments: AttachmentModel[];
  public questions: QuestionModel[];
  public feedback: number; // 1-4 -> feedback is set, 0 -> not set

}
