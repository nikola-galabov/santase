var express = require('express');
var app = express();
var path = require('path');
var server = require('http').Server(app);
var io = require('socket.io')(server);

var Player = require('./modules/Player');
var Game = require('./modules/Game');

var port = process.config.port || '1948';

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));


// for testing
var cards = [{"value":"A","suit":"♠","id":"A♠"},{"value":"9","suit":"♥","id":"9♥"},{"value":"J","suit":"♥","id":"J♥"},{"value":"10","suit":"♥","id":"10♥"},{"value":"A","suit":"♥","id":"A♥"},{"value":"Q","suit":"♠","id":"Q♠"},{"value":"K","suit":"♦","id":"K♦"},{"value":"10","suit":"♣","id":"10♣"},{"value":"10","suit":"♠","id":"10♠"},{"value":"9","suit":"♦","id":"9♦"},{"value":"J","suit":"♣","id":"J♣"},{"value":"K","suit":"♥","id":"K♥"},{"value":"10","suit":"♦","id":"10♦"},{"value":"9","suit":"♣","id":"9♣"},{"value":"K","suit":"♠","id":"K♠"},{"value":"A","suit":"♦","id":"A♦"},{"value":"K","suit":"♣","id":"K♣"},{"value":"A","suit":"♣","id":"A♣"},{"value":"J","suit":"♠","id":"J♠"},{"value":"9","suit":"♠","id":"9♠"},{"value":"Q","suit":"♦","id":"Q♦"},{"value":"Q","suit":"♣","id":"Q♣"},{"value":"J","suit":"♦","id":"J♦"},{"value":"Q","suit":"♥","id":"Q♥"}];
cards = undefined;

app.get('/', function(req, res){    
    // var player1 = new Player('Nikola');
    // var player2 = new Player('Petkan');
    // var theGame = new Game(player1, player2, cards);

    // console.log(JSON.stringify(theGame.deck.getCards()));
    
    // res.render('index', {theGame});
    res.sendFile(path.join(__dirname, 'public/views/index.html'));
});

var theGame = new Game(cards);
var cardsForCurrentHand = 0;
io.on('connection', function (socket) {
    var player = new Player(socket.id, 'Nikola');
    if(theGame.connectedPlayers < 2) {
        theGame.addPlayer(player);
    }

    if(theGame.connectedPlayers === 2) {
        theGame.init();
        sendCardsToPlayers();
    }

    socket.on('playCard', function (cardId) {
        var thePlayer = theGame.getPlayerById(socket.id);
        var theOtherPlayer = theGame.getTheOtherPlayer(socket.id);
        var card = thePlayer.getCard(cardId);
        if(!card) {
            // should throw exception or something like this
        }

        theGame.currentHand[thePlayer.id] = card;
        cardsForCurrentHand++;
        theOtherPlayer.isOnTurn = true;
        thePlayer.isOnTurn = false;
        if(cardsForCurrentHand === 2) {
           theOtherPlayer.isOnTurn = false; 
        }

        // send the data to the other player
        askPlayerForResponse(theOtherPlayer, theGame.currentHand, thePlayer); 

        // next hand
        if(cardsForCurrentHand === 2) {
            cardsForCurrentHand = 0;
            theGame.updateResult(theGame.currentHand);
            setTimeout(sendCardsToPlayers, 2000); // or may be there is other better way
        }
    });

    socket.on('disconnect', function(){
        var newPlayerInstance;
        var theOtherPlayer = theGame.getTheOtherPlayer(socket.id);
        theGame = new Game(cards);
        if(! theOtherPlayer) {
            return;
        }

        newPlayerInstance = new Player(theOtherPlayer.id, theOtherPlayer.name);
        theGame.addPlayer(newPlayerInstance);
    });
});

server.listen(port);

// logyc that should be extracted somewhere else
function sendCardsToPlayers() {
    io.to(theGame.player1.id).emit('getCards', {
        cards: theGame.player1.getCards(),
        gameSuit: theGame.gameSuit,
        isOnTurn: theGame.player1.isOnTurn,
        myPoints: theGame.player1.points,
        otherPlayerPoints: theGame.player2.points,
        cardsInDeck: theGame.deck.getCards().length
    });

    io.to(theGame.player2.id).emit('getCards', { 
        cards: theGame.player2.getCards(),
        gameSuit: theGame.gameSuit,
        isOnTurn: theGame.player2.isOnTurn,
        myPoints: theGame.player2.points,
        otherPlayerPoints: theGame.player1.points,
        cardsInDeck: theGame.deck.getCards().length
    });
}

function askPlayerForResponse(player, currentHand, otherPlayer) {
    io.to(player.id).emit('myTurn', {
        currentHand: currentHand,
        isOnTurn: player.isOnTurn,
        otherPlayer: otherPlayer.id
    });
}