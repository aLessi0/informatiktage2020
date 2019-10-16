import {Component, Inject} from '@angular/core';
import {ProgressService} from '../../../service/progress.service';
import {FeedbackAnswer} from '../../../model/user/feedback-answer.model';
import {ProgressModel} from '../../../model/user/progress.model';
import {DataService} from '../../../service/data.service';
import {ModalService} from '../../../service/modal.service';
import {HttpClient} from '@angular/common/http';
import {ContestModel} from '../../../model/user/contest.model';

@Component({
  selector: 'app-feedback-detailliert',
  templateUrl: './feedback-informatiktage.component.html',
  styleUrls: ['./feedback-informatiktage.component.scss']
})
export class FeedbackInformatiktageComponent {
  public feedBackState: IFeedbackState;
  public contest: ContestModel;
  private progress: ProgressModel;

  constructor(@Inject(ProgressService) private readonly progressService: ProgressService,
              @Inject(DataService) private readonly dataService: DataService,
              @Inject(ModalService) private readonly modalService: ModalService,
              @Inject(HttpClient) private readonly httpClient: HttpClient) {
    this.feedBackState = new Feedback1(this.progressService, this.dataService);
    while (this.feedBackState && this.feedBackState.canProceed()) {
      this.feedBackState = this.feedBackState.next();
    }

    this.progressService.progress$.subscribe(progress => {
      this.progress = progress;
      this.contest = this.progress.contest;
    });
  }

  public sendFeedback() {
    // const body = JSON.stringify(Array.from(this.progress.feedbackAnswers.entries()));
    const body = Array.from(this.progress.feedbackAnswers.entries());
    console.log(body);
    this.httpClient.post('/api/feedback', body).subscribe(() => {
      this.progress.canTakePartInContest = true;
      this.progress.contest = new ContestModel();
      this.progressService.updateProgress(this.progress);
    });
  }

  public close() {
    this.modalService.closeDialog();
  }

  public toLast() {
    this.feedBackState = new Feedback5(this.progressService, this.dataService);
  }

  public teilnehmen(): void {
    if (this.contest.yearOfBirth
      && this.isValidEmail()
      && this.contest.lastName
      && this.contest.firstName) {
      this.httpClient.post('/api/wettbewerb', this.contest).subscribe(() => {
        this.progress.takesPartInContest = true;
        this.progressService.updateProgress(this.progress);
        this.close();
      });
    }
  }

  public isValidEmail(): boolean {
    return this.contest.eMail &&
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(this.contest.eMail);
  }
}

export abstract class FeedbackState implements IFeedbackState {
  public feedbackModel: any;
  public answer: FeedbackAnswer;
  public isSelection = true;

  protected progress: ProgressModel;
  protected feedbackModels: any[];

  private readonly nextState: new (progressService: ProgressService, dataService: DataService) => FeedbackState;
  private readonly prevState: new (progressService: ProgressService, dataService: DataService) => FeedbackState;

  constructor(protected progressService: ProgressService,
              protected dataService: DataService) {
    this.progressService.progress$.subscribe(progress => this.progress = progress);
    this.dataService.game$.subscribe(game => {
      this.feedbackModels = game.feedback;
      this.feedbackModel = this.feedbackModels.filter(potentialFeedback => potentialFeedback.number === this.questionNr())[0];

      if (this.feedbackModel && !this.progress.feedbackAnswers.has(this.feedbackModel.number)) {
        this.answer = new FeedbackAnswer();
        this.answer.number = this.feedbackModel.number;
        this.progress.feedbackAnswers.set(this.answer.number, this.answer);
      } else if (this.feedbackModel) {
        this.answer = this.progress.feedbackAnswers.get(this.feedbackModel.number);
      }

    });


    this.nextState = this.getNextState();
    this.prevState = this.getPrevState();
  }

  protected updateProgress(): void {
    this.progressService.updateProgress(this.progress);
  }

  public canProceed(): boolean {
    return false;
  }

  next(): FeedbackState | undefined {
    this.updateProgress();
    if (this.nextState) {
      return new this.nextState(this.progressService, this.dataService);
    }
    return undefined;
  }

  back(): FeedbackState | undefined {
    this.updateProgress();
    if (this.prevState) {
      return new this.prevState(this.progressService, this.dataService);
    }
    return undefined;
  }

  canGoBack(): boolean {
    return true;
  }


  protected abstract questionNr(): number;

  protected abstract getNextState(): new (progressService: ProgressService, dataService: DataService) => FeedbackState;

  protected abstract getPrevState(): new (progressService: ProgressService, dataService: DataService) => FeedbackState;
}

export abstract class MandatoryFeedback extends FeedbackState {

  canProceed(): boolean {
    return this.answer && this.answer.answer;
  }

}

export class Feedback1 extends MandatoryFeedback {

  protected getNextState(): { new(progressService: ProgressService, dataService: DataService): FeedbackState } {
    return Feedback2;
  }

  protected getPrevState(): { new(progressService: ProgressService, dataService: DataService): FeedbackState } {
    return undefined;
  }

  protected questionNr(): number {
    return 1;
  }

  canGoBack(): boolean {
    return false;
  }

}

export class Feedback2 extends MandatoryFeedback {

  protected getNextState(): { new(progressService: ProgressService, dataService: DataService): FeedbackState } {
    return Feedback3;
  }

  protected getPrevState(): { new(progressService: ProgressService, dataService: DataService): FeedbackState } {
    return Feedback1;
  }

  protected questionNr(): number {
    return 2;
  }
}

export class Feedback3 extends MandatoryFeedback {

  protected getNextState(): { new(progressService: ProgressService, dataService: DataService): FeedbackState } {
    return Feedback4;
  }

  protected getPrevState(): { new(progressService: ProgressService, dataService: DataService): FeedbackState } {
    return Feedback2;
  }

  protected questionNr(): number {
    return 3;
  }
}

export class Feedback4 extends FeedbackState {
  public isSelection = false;

  protected getNextState(): { new(progressService: ProgressService, dataService: DataService): FeedbackState } {
    return Feedback5;
  }

  protected getPrevState(): { new(progressService: ProgressService, dataService: DataService): FeedbackState } {
    return Feedback3;
  }

  canProceed(): boolean {
    return true;
  }

  protected questionNr(): number {
    return 4;
  }

}

export class Feedback5 extends FeedbackState {
  public isSelection = false;

  protected questionNr(): number {
    return 5;
  }

  canProceed(): boolean {
    return true;
  }

  protected getNextState(): { new(progressService: ProgressService, dataService: DataService): FeedbackState } {
    return undefined;
  }

  protected getPrevState(): { new(progressService: ProgressService, dataService: DataService): FeedbackState } {
    return Feedback4;
  }
}


export interface IFeedbackState {

  feedbackModel: any;

  answer: FeedbackAnswer;

  isSelection: boolean;

  next(): FeedbackState | undefined;

  back(): FeedbackState | undefined;

  canGoBack(): boolean;

  canProceed(): boolean;
}
