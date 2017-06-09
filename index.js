var express = require('express');
var app = express();
var port = process.config.port || '1948';
var Player = require('./modules/Player');
var Game = require('./modules/Game');
var player1 = new Player();
var player2 = new Player();
var theGame = new Game(player1, player2);

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
theGame.start();

app.get('/', function(req, res){    
    res.render('index', {theGame});
});

app.listen(port);