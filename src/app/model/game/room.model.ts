import {AttachmentModel} from './attachment.model';
import {QuestionModel} from './question.model';

export class RoomModel {
  private _level: number;
  public isUnlocked: boolean;
  public justUnlocked: boolean;
  public name: string;
  public logo: string;
  public color: string;
  public intro: string;
  public attachments: AttachmentModel[];
  public questions: QuestionModel[];
  public feedback: number; // 1-3 -> feedback is set, 0 -> not set

  public set level(level: number) {
    this._level = level;
  }

  public get level() {
    return this._level;
  }
}
