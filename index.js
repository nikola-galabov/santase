var express = require('express');
var app = express();
var port = process.config.port || '1948';
var Player = require('./modules/Player');
var Game = require('./modules/Game');

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));


// for testing
var cards = [{"value":"A","suit":"♠","id":"A♠"},{"value":"9","suit":"♥","id":"9♥"},{"value":"J","suit":"♥","id":"J♥"},{"value":"10","suit":"♥","id":"10♥"},{"value":"A","suit":"♥","id":"A♥"},{"value":"Q","suit":"♠","id":"Q♠"},{"value":"K","suit":"♦","id":"K♦"},{"value":"10","suit":"♣","id":"10♣"},{"value":"10","suit":"♠","id":"10♠"},{"value":"9","suit":"♦","id":"9♦"},{"value":"J","suit":"♣","id":"J♣"},{"value":"K","suit":"♥","id":"K♥"},{"value":"10","suit":"♦","id":"10♦"},{"value":"9","suit":"♣","id":"9♣"},{"value":"K","suit":"♠","id":"K♠"},{"value":"A","suit":"♦","id":"A♦"},{"value":"K","suit":"♣","id":"K♣"},{"value":"A","suit":"♣","id":"A♣"},{"value":"J","suit":"♠","id":"J♠"},{"value":"9","suit":"♠","id":"9♠"},{"value":"Q","suit":"♦","id":"Q♦"},{"value":"Q","suit":"♣","id":"Q♣"},{"value":"J","suit":"♦","id":"J♦"},{"value":"Q","suit":"♥","id":"Q♥"}];

cards = undefined;

app.get('*', function(req, res){    
    var player1 = new Player('Nikola');
    var player2 = new Player('Petkan');
    var theGame = new Game(player1, player2, cards);

    console.log(JSON.stringify(theGame.deck.getCards()));
    theGame.init();
    res.render('index', {theGame});
});

app.listen(port);