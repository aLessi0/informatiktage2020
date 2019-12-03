import {Component, OnInit} from '@angular/core';
import {BorderWidth, Chart, ChartColor, Point} from 'chart.js';

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
      this.createTimeSeriesRaum();
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

  public filteredRaeume(raumList: any[]) {
    if (raumList) {
      return raumList.filter((val, index) => index > 0);
    }
  }

  private onMessage(msg): Promise<any> {
    return new Promise((resolve, reject) => {
      const parsedValue = JSON.parse(msg.data);
      console.log(parsedValue);
      resolve(parsedValue);
    });

  }

  private createTimeSeriesRaum() {
    setTimeout(() => {
      const ctx = (document.getElementById('feedbackOverTime') as HTMLCanvasElement).getContext('2d');
      const feedbackPer10Min = new Map();

      this.raumFeedback.forEach((raum) => {
        const feedbackDate = new Date(parseInt(raum.timestamp as any));

        feedbackDate.setMilliseconds(0);
        feedbackDate.setSeconds(0);
        feedbackDate.setMinutes(Math.floor(feedbackDate.getMinutes() / 10) * 10);

        if (!feedbackPer10Min.has(feedbackDate.getTime())) {
          feedbackPer10Min.set(feedbackDate.getTime(), 0);
        }
        feedbackPer10Min.set(feedbackDate.getTime(), feedbackPer10Min.get(feedbackDate.getTime()) + 1);
      });
      const aggregatedData = Array.from(feedbackPer10Min.entries()).map((tuple) => {
        return {x: new Date(tuple[0]), y: tuple[1]};
      });

      const myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [
            {
              data: aggregatedData.slice(Math.max(0, aggregatedData.length - 30), aggregatedData.length),
              label: 'Anzahl Feedbacks über Zeit'
            }
          ]
        },
        options: {
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                displayFormats: {
                  minute: 'h:mm'
                }
              }
            }],
            yAxes: [{
              ticks: {
                min: 0
              }
            }]
          }
        }
      });

    });
  }

}


export class RaumData {
  timestamp: number;
  uuid: string;
  roomNumber: number;
  roomName: string;
  roomFeedback: number;
}

export class InformatiktageFeedback {
  timestamp: number;
  uuid: string;
  feedbackNumber: number;
  feedback: number;
}

export class Insights {
  nmbOfFeedbacksPerRaum: number[];
  verhaeltnisUserRaumFeedbackItFeedback: number;
  avgUserFeedbackAnzahl: number;
  nmbOfFeedbackRaum: number;
  nmbOfFeedbackIt: number;
  avgRaum: number[];
  avgIt: number[];
}
