import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  public raumFeedback: RaumData[] = [];
  public informatiktageFeedback: Array<InformatiktageFeedback[]> = [];
  public insights: Insights;

  private readonly URL_RAUM: string = '/ws/raum';
  private readonly URL_INFORMATIKTAGE: string = '/ws/informatiktage';
  private readonly URL_AGGREGATED: string = '/ws/aggregated';

  constructor() {
  }

  ngOnInit() {
    this.connectRaumFeedback();
    this.connectInformatiktageFeedback();
    this.connectAggregated();
  }


  public connectRaumFeedback(): void {
    const host = location.origin.replace(/^http/, 'ws');
    console.log('connecting to ', (host + this.URL_RAUM));
    const ws = new WebSocket(host + this.URL_RAUM);

    ws.onmessage = (msg) => this.onMessage(msg).then((raumFeedback: RaumData) => {
      this.raumFeedback.push(raumFeedback);
    });
  }

  public connectInformatiktageFeedback(): void {
    const host = location.origin.replace(/^http/, 'ws');
    console.log('connecting to ', (host + this.URL_INFORMATIKTAGE));
    const ws = new WebSocket(host + this.URL_INFORMATIKTAGE);

    ws.onmessage = (msg) => this.onMessage(msg).then((informatiktageFeedback: InformatiktageFeedback[]) => {
      this.informatiktageFeedback.push(informatiktageFeedback);
    });
  }

  public connectAggregated(): void {
    const host = location.origin.replace(/^http/, 'ws');
    console.log('connecting to ', (host + this.URL_AGGREGATED));
    const ws = new WebSocket(host + this.URL_AGGREGATED);

    ws.onmessage = (msg) => this.onMessage(msg).then((insights: Insights) => {
      console.log(insights);
      this.insights = insights;
    });
  }

  private onMessage(msg): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(JSON.parse(msg.data));
    });

  }

}


export class RaumData {
  roomNumber: number;
  roomName: string;
  roomFeedback: number;
}

export class InformatiktageFeedback {
  feedbackNumber: number;
  feedback: number;
}

export class Insights {
  nmbOfFeedbackRaum: number;
  nmbOfFeedbackIt: number;
  avgRaum: number[];
  avgIt: number[];
}
