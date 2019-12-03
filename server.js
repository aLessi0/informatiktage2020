let WebSocketServer = require("ws").Server;
let http = require("http");
let express = require("express");
let bodyParser = require('body-parser');
let fs = require('fs');
let urlp = require('url');
let events = require('events');
let eventEmitter = new events.EventEmitter();
let readline = require('readline');

const app = express();
app.use(express.static(__dirname + "/dist/informatiktage2020"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const server = http.createServer(app);
const port = 4300;
server.listen(port);

const feedback_file_informatiktage = 'feedback_informatiktage.csv';
const feedback_file_raeume = 'feedback_raeume.csv';


/* websocket for analysis */
const wss_raum = new WebSocketServer({noServer: true});
const wss_informatiktage = new WebSocketServer({noServer: true});
const wss_aggregated = new WebSocketServer({noServer: true});

server.on('upgrade', (req, socket, head) => {
  const pathname = urlp.parse(req.url).pathname;
  console.log('trying to upgrade');

  if (pathname === '/ws/raum') {
    wss_raum.handleUpgrade(req, socket, head, (ws) => {
      wss_raum.emit('connection', ws);
    });
  }

  if (pathname === '/ws/informatiktage') {
    wss_informatiktage.handleUpgrade(req, socket, head, (ws) => {
      wss_informatiktage.emit('connection', ws);
    });
  }

  if (pathname === '/ws/aggregated') {
    wss_aggregated.handleUpgrade(req, socket, head, (ws) => {
      wss_aggregated.emit('connection', ws);
    });
  }

});

wss_raum.on("connection", (ws) => {

  /* on ws connection fetch and send all data*/
  getRaeumeFeedback((feedback) => {
    ws.send(JSON.stringify(feedback));
  });

  eventEmitter.on('raum_msg', (data) => {
    console.log('received msg from raum', data);
    if (ws) {
      /* stupid eventemitter only works with array like data */
      ws.send(JSON.stringify(data[0]));
    }
  });

  ws.on("close", function () {
    ws = undefined;
  })
});


wss_informatiktage.on("connection", (ws) => {

  /* on ws connection fetch and send all data*/
  getFeedbackFromCsv((feedback) => {
    ws.send(JSON.stringify(feedback))

  });

  eventEmitter.on('informatiktage_msg', (data) => {
    if (ws) {
      ws.send(JSON.stringify(data));
    }
  });

  ws.on("close", function () {
    ws = undefined;
  })
});

wss_aggregated.on("connection", (ws) => {

  /* on ws connection fetch and send all data*/
  getInsights((insights) => {
    ws.send(JSON.stringify(insights));
  });

  eventEmitter.on('aggregated_msg', () => {
    if (ws) {
      getInsights((insights) => {
        ws.send(JSON.stringify(insights));
      });
    }
  });

  ws.on("close", function () {
    ws = undefined;
  })
});


app.post('/api/feedback/raum', (req, resp) => {
  csvRaeume = req.body.timestamp + ',' + req.body.userId + ',' + req.body.roomNumber + ',' + req.body.roomName + ',' + req.body.roomFeedback + '\n';
  req.body.uuid = req.body.userId;
  delete req.body.userId;
  console.log('writing feebdack raum:', csvRaeume);
  fs.appendFile(feedback_file_raeume, csvRaeume, () => {
    /* stupid eventemitter only works with array like data */
    eventEmitter.emit('raum_msg', [req.body]);
    eventEmitter.emit('aggregated_msg');
    resp.send();
  });
});

app.post('/api/feedback/informatiktage', (req, resp) => {
  csvArrayInformatiktage = [];
  req.body.informatiktage.forEach((tuple) => csvArrayInformatiktage[tuple[0] - 1] = tuple[1].answer ? tuple[1].answer : '');
  csvInformatiktage = req.body.timestamp + ',' + req.body.userId + ',' + csvArrayInformatiktage.join(',') + '\n';
  req.body.uuid = req.body.userId;
  delete req.body.userId;
  console.log('writing feedback informatiktage:', csvInformatiktage);
  fs.appendFile(feedback_file_informatiktage, csvInformatiktage, () => {
    eventEmitter.emit('informatiktage_msg', req.body);
    eventEmitter.emit('aggregated_msg');
    resp.send();
  });
});

app.get('/api/feedback/download/informatiktage', (req, resp) => {
  let timestring = new Date().toLocaleString('de-CH', {timezone: "Europe/Zurich", hourCycle: "h24"});
  resp.download(feedback_file_informatiktage, 'feedback-informatiktage-' + timestring + '.csv');
});

app.get('/api/feedback/download/raum', (req, resp) => {
  let timestring = new Date().toLocaleString('de-CH', {timezone: "Europe/Zurich", hourCycle: "h24"});
  resp.download(feedback_file_raeume, 'feedback-raeume-' + timestring + '.csv');
});


function getInsights(callback) {
  getAllRaueme((feedbackRaueme) => {
    getAllITFeedback((feedbackIt) => {
      const nmb_of_feedback_raum = feedbackRaueme.length;
      const nmb_of_feedback_it = feedbackIt.length;

      const nmb_of_feedback_per_raum = new Map();
      const feedback_per_user = new Map();

      feedbackRaueme.forEach((raum) => {
        if (!nmb_of_feedback_per_raum.has(raum.roomNumber)) {
          nmb_of_feedback_per_raum.set(raum.roomNumber, 0);
        }
        nmb_of_feedback_per_raum.set(raum.roomNumber, nmb_of_feedback_per_raum.get(raum.roomNumber) + 1);

        if (!feedback_per_user.has(raum.uuid)) {
          feedback_per_user.set(raum.uuid, []);
        }
        feedback_per_user.get(raum.uuid).push(raum);

      });

      avg_raum = [];
      feedbackRaueme.forEach((raum) => {
        avg_raum[raum.roomNumber] = (avg_raum[raum.roomNumber] ? avg_raum[raum.roomNumber] : 0) + (1 / nmb_of_feedback_per_raum.get(raum.roomNumber)) * raum.roomFeedback;
      });

      avg_it = [];
      feedbackIt.forEach((feedbackItPerUser) => {
        feedbackItPerUser.forEach((feedbackQuestion) => {
          if (feedbackQuestion.feedbackNumber < 3) {
            avg_it[feedbackQuestion.feedbackNumber] = (avg_it[feedbackQuestion.feedbackNumber] ? avg_it[feedbackQuestion.feedbackNumber] : 0) + (1 / nmb_of_feedback_it) * feedbackQuestion.feedback;
          }
        })

      });

      let avg_user_feedback_anzahl = 0;
      feedback_per_user.forEach((feedbacks, userId) => {
        avg_user_feedback_anzahl += (1 / feedback_per_user.size) * feedbacks.length;
      });

      const nmbOfFeedbacksPerRaum = [];
      nmb_of_feedback_per_raum.forEach((anzahlFeedbacks, raumNr) => {
        nmbOfFeedbacksPerRaum[raumNr] = anzahlFeedbacks;
      });

      callback({
        nmbOfFeedbacksPerRaum,
        nmbOfFeedbackRaum: nmb_of_feedback_raum,
        nmbOfFeedbackIt: nmb_of_feedback_it,
        avgRaum: avg_raum,
        avgIt: avg_it,
        avgUserFeedbackAnzahl: avg_user_feedback_anzahl,
        verhaeltnisUserRaumFeedbackItFeedback: feedbackIt.length / feedback_per_user.size
      })

    });
  })
}


function getFeedbackFromCsv(callback) {
  const rl = readline.createInterface({
    input: fs.createReadStream(feedback_file_informatiktage),
    crlfDelay: Infinity
  });

  rl.on('line', (line) => {
    const values = line.split(',');
    feedback = [
      {feedbackNumber: 0, feedback: values[2], uuid: values[1], timestamp: values[0]},
      {feedbackNumber: 1, feedback: values[3], uuid: values[1], timestamp: values[0]},
      {feedbackNumber: 2, feedback: values[4], uuid: values[1], timestamp: values[0]},
      {feedbackNumber: 3, feedback: values[5], uuid: values[1], timestamp: values[0]}
    ];
    callback(feedback);
  });
}

function getRaeumeFeedback(callback) {
  const rl = readline.createInterface({
    input: fs.createReadStream(feedback_file_raeume),
    crlfDelay: Infinity
  });

  rl.on('line', (line) => {
    const values = line.split(',');
    callback({
      timestamp: values[0],
      uuid: values[1],
      roomNumber: values[2],
      roomName: values[3],
      roomFeedback: values[4]
    })
  });
}

function getAllRaueme(callback) {
  const raeume = [];
  const rl = readline.createInterface({
    input: fs.createReadStream(feedback_file_raeume),
    crlfDelay: Infinity
  });

  rl.on('line', (line) => {
    const values = line.split(',');
    raeume.push({
      roomNumber: values[2],
      roomName: values[3],
      roomFeedback: values[4],
      uuid: values[1],
      timestamp: values[0]
    })
  });

  rl.on('close', () => {
    callback(raeume);
  })
}

function getAllITFeedback(callback) {
  const feedbacks = []
  const rl = readline.createInterface({
    input: fs.createReadStream(feedback_file_informatiktage),
    crlfDelay: Infinity
  });

  rl.on('line', (line) => {
    const values = line.split(',');
    feedback = [
      {feedbackNumber: 0, feedback: values[2], uuid: values[1], timestamp: values[0]},
      {feedbackNumber: 1, feedback: values[3], uuid: values[1], timestamp: values[0]},
      {feedbackNumber: 2, feedback: values[4], uuid: values[1], timestamp: values[0]},
      {feedbackNumber: 3, feedback: values[5], uuid: values[1], timestamp: values[0]}
    ];
    feedbacks.push(feedback);
  });

  rl.on('close', () => {
    callback(feedbacks);
  })
}
