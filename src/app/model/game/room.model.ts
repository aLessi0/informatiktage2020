import {AttachmentModel} from './attachment.model';
import {QuestionModel} from './question.model';

export class RoomModel {
  private _level: number;
  public name: string;
  public logo: string;
  public color: string;
  public intro: string;
  public attachments: AttachmentModel[];
  public questions: QuestionModel[];

  public set level(level: number) {
    this._level = level;
  }

  public get level() {
    return this._level;
  }
}
