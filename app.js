// app.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var express = require('express');

var app = express();
var http = require('http');
var https = require('https');
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var bodyParser = require("body-parser");

console.log("Folder:"+__dirname);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/bower_components'));
app.get('/', function (req, res, next) {
    res.sendFile("index.html");
});
var port = 3000;
server.listen(process.env.PORT || port);
// Import the module 
var polo = require("poloniex-unofficial");
 
// Get access to the push API 
var poloPush = new polo.PushWrapper();

// Get price ticker updates 
poloPush.ticker((err, response) => {
    if (err) {
        // Log error message 
        console.log("An error occurred: " + err.msg);
 
        // Disconnect 
        return true;
    }
    io.emit('message', response); 
    // Check if this currency is in the watch list 
    if (watchList.indexOf(response.currencyPair) > -1) {
        // Log the currency pair and its last price 
        console.log(response.currencyPair + ": " + response.last);
    }
});
