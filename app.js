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
    res.sendFile(__dirname + '/index.html');
});
var port = 3000;
server.listen(process.env.PORT || port);

const ticker = require('cryptocurrency-ticker');

ticker.availableExchanges().then((exchanges) => {
	console.log(exchanges);
});

ticker.availablePairs('kraken').then((pairs) => {
	console.log(pairs);
}).catch((err) => {
	console.error(err);
});

ticker.ticker('kraken', 'eth_jpy').then((ticker) => {
	console.log(ticker);
}).catch((err) => {
	console.error(err);
});
