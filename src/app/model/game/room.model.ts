import {AttachmentModel} from './attachment.model';
import {QuestionModel} from './question.model';

export class RoomModel {
  public level: number;
  public isUnlocked: boolean;
  public justUnlocked: boolean;
  public name: string;
  public logo: string;
  public color: string;
  public intro: string;
  public attachments: AttachmentModel[];
  public questions: QuestionModel[];
  public feedback: number; // 1-4 -> feedback is set, 0 -> not set

}
