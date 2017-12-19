require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const bodyParser = require('body-parser');
const routes = require('./bin/routes');

app.use(express.static(__dirname));

// Set Cors
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// For receiving request params from client
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Views

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// App Routes
routes(app);

// Start Host
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }

  console.log(`################### Server is running at port ${port} ###################`);
})
