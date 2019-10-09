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

app.get('*', (req, resp) => {
  resp.sendFile(__dirname + "/dist/informatiktage2020/index.html")
});
