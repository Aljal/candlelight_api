'use strict';

// Includes
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
var cors = require('cors');
require('dotenv').config();

const host = process.env.HOST;
const port = process.env.PORT;

var app = express()

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' })

// Log requests to the access.log
app.use(morgan(':remote-addr\t:method\t:url\t:status\t:response-time ms\t:date[web]', { stream: accessLogStream }));

// Log requests to the console
app.use(morgan('dev'));
app.use(morgan(':remote-addr :date[web]'));

// Index.html at root
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// App images
app.use('/api/public', express.static(__dirname + '/public'));

// Require our routes into the application.
require('./server/routes')(app);

// Return default result for not in routes get requests
app.get('*', (req, res) => res.status(400).send({
  error: 'URL not found'
}));

// Return default result for not in routes post requests
app.post('*', (req, res) => {
  console.log('POST Request: ' + JSON.stringify(req.body));
  return res.status(404).send({
    error: 'URL not found'
  });
});

// Define port - ip and start server
var server = app.listen(port, host, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Server listening at http://%s:%s', host, port)
})

module.exports = app;