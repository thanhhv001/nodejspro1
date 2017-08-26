// app.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var express = require('express');
var router = express.Router();
var request = require('request');
var app = express();
var http = require('http');
var https = require('https');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var bittrex = require('node.bittrex.api');
var autobahn = require('autobahn');
var wsuri = "wss://api.poloniex.com";
var bodyParser = require("body-parser");

var connection = new autobahn.Connection({
    url: wsuri,
    realm: "realm1"
});

console.log("Folder:"+__dirname);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/bower_components'));

app.get('/', function (req, res, next) {    
  res.sendFile(__dirname + '/index.html');
});

app.post('/getPTicker',function(req, res, nex){
	var url = 'https://poloniex.com/public?command=returnTicker';
    var body = '';
    getTicker(req, res, nex,url);
})

app.post('/getBTicker',function(req, res, nex){
	var url = 'https://bittrex.com/api/v1.1/public/getmarketsummaries';
    var body = '';
    getTicker(req, res, nex,url);
	
})

function getTicker(req, res, nex,url){
	var body = '';
	https.get(url, function(response){
        response.on('data', function(chunk){
            body += chunk;
        });

        response.on('end', function(){
            
            res.json(body);
			console.log(body);
        });
    }).on('error', function(e){
          console.log("Got an error: ", e);
          res.json(e);
    });	
}
var port = 3000;
server.listen(process.env.PORT || port);
//Polo get ticker
io.on('connection', function (client) {
	
    console.log('Client connected...');

    client.on('join', function (data) {
        console.log(data);
    });
    
    client.on('sendMessages', function (data) {
        io.emit('broadcastMessages', data);
    });
	
    client.on('tradeCoin',function(data){
        io.emit('BTC_XMR',data);
    });
	
	
});

connection.onopen = function (session) {
    console.log("Websocket connection open");
    function marketEvent(args, kwargs) {             
        io.emit('tradeCoin', args);
    }
	
    function tickerEvent(args, kwargs) {
		console.log(args);
        io.emit('messages', args);
    }

    session.subscribe('BTC_XMR', marketEvent);
    session.subscribe('ticker', tickerEvent);

}

connection.onclose = function (a,b) {
    console.log(b);
    console.log("Websocket connection closed");
}

connection.open();

//bittrex
bittrex.websockets.listen( function( data ) {
  if (data.M === 'updateSummaryState') {
    data.A.forEach(function(data_for) {
      data_for.Deltas.forEach(function(marketsDelta) {
        io.emit('bittrexMessages', marketsDelta);
         console.log('Ticker Update for '+ marketsDelta.MarketName, marketsDelta);
      });
    });
  }
});


