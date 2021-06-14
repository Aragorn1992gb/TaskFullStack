var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const config = require('./db');
const PORT = 8080;
const validator = require('validator');
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));
app.use(express.json());

app.use(express.static('resources'));
global.__basedir = __dirname;
 
require('./app/routes/customer.route.js')(app);

// const redis = require('redis');


// Create a Server
var server = app.listen(PORT, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("App listening at http://%s:%s", host, port) 
})