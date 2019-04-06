// server.js
var express = require('express');
var app = express();
var port = 8080;

// route the app
var router = require('./app/routes');
app.use('/', router);

// use static files
app.use(express.static(__dirname + '/public'));

// start the server
app.listen(port, function() {
  console.log('app started');
});
