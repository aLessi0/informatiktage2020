let http = require("http");
let express = require("express");
let bodyParser = require('body-parser');
let fs = require('fs');

const app = express();
app.use(express.static(__dirname + "/dist/informatiktage2020"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const server = http.createServer(app);
const port = 4300;
server.listen(port);

app.get('/api/writeGet', (req, resp) => {
  console.log("works on backend");
  resp.send()
});

app.post('/api/write', (req, resp) => {
  fs.appendFile('test.csv', 'a,b,c\n', 'utf8', (err) => {
    if (err) {
      throw Error("could not write to csv")
    } else {
      resp.send()
    }
  })
});

app.post('/api/feedback', (req, resp) => {
  csv = [];
  req.body.forEach((tuple) => csv[tuple[0] - 1] = tuple[1].answer ? tuple[1].answer : '');
  console.log(csv);
  fs.appendFile('feedback.csv', csv.join(',') + "\n", () => {
    resp.send();
  })
});

app.post('/api/wettbewerb', (req, resp) => {
  csv = '';
  const bodyObjectAsArray = Object.keys(req.body).map(function (key) {
    return [key, req.body[key]];
  });
  // needs to be sorted for csv reasons.
  const sortedValues = sortTuplesArray(bodyObjectAsArray);

  sortedValues.forEach((tuple) => {
    csv += tuple[1] + ',';
  });

  csv = csv.substring(0, csv.length - 1) + "\n";
  console.log(csv);
  fs.appendFile('wettbewerb.csv', csv, () => {
    resp.send();
  })
});

app.get('*', (req, resp) => {
  resp.sendFile(__dirname + "/dist/informatiktage2020/index.html")
});


function sortTuplesArray(arrayToSort) {
  return arrayToSort.sort((cur, next) => {
    keyCur = cur[0].toLowerCase();
    keyNext = next[0].toLowerCase();
    if (keyCur < keyNext) {
      return -1
    } else {
      return 1
    }
  });
}
