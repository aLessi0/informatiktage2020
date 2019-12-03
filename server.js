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
  csvRaeume = req.body.userId + ',' + req.body.roomNumber + ',' + req.body.roomName + ',' + req.body.roomFeedback + '\n';
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
  csvInformatiktage = req.body.userId + ',' + csvArrayInformatiktage.join(',') + '\n';
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
      nmb_of_feedback_raum = feedbackRaueme.length;
      nmb_of_feedback_it = feedbackIt.length;

      nmb_of_feedback_per_raum = new Map();
      feedbackRaueme.forEach((raum) => {
        if (!nmb_of_feedback_per_raum.has(raum.roomNumber)) {
          nmb_of_feedback_per_raum.set(raum.roomNumber, 0);
        }
        nmb_of_feedback_per_raum.set(raum.roomNumber, nmb_of_feedback_per_raum.get(raum.roomNumber) + 1);
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

      callback({
        nmbOfFeedbackRaum: nmb_of_feedback_raum,
        nmbOfFeedbackIt: nmb_of_feedback_it,
        avgRaum: avg_raum,
        avgIt: avg_it
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
      {feedbackNumber: 0, feedback: values[0]},
      {feedbackNumber: 1, feedback: values[1]},
      {feedbackNumber: 2, feedback: values[2]},
      {feedbackNumber: 3, feedback: values[3]}
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
    callback({roomNumber: values[0], roomName: values[1], roomFeedback: values[2]})
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
    raeume.push({roomNumber: values[0], roomName: values[1], roomFeedback: values[2]})
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
      {feedbackNumber: 0, feedback: values[0]},
      {feedbackNumber: 1, feedback: values[1]},
      {feedbackNumber: 2, feedback: values[2]},
      {feedbackNumber: 3, feedback: values[3]}
    ];
    feedbacks.push(feedback);
  });

  rl.on('close', () => {
    callback(feedbacks);
  })
}
