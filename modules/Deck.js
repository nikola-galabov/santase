var Card = require('./Card');
var cards = [];
var suits = ['♠', '♥', '♦',	'♣'];
// Spade Suit	- Pika
// Heart Suit
// Diamond Suit	
// Club Suit

var values = ['9', '10', 'J', 'Q', 'K', 'A'];

function initDeck() {
    cards = [];
    suits.forEach(function(suit){
        values.forEach(function(value){
            var currentCard = new Card(value, suit);
            cards.push(currentCard);
        });
    });
}

function _getDeckCards() {
    return cards;
}

function shuffleCards() {
    for (var i = cards.length; i; i--) {
        var newIndex = Math.floor(Math.random() * i);
        [cards[i - 1], cards[newIndex]] = [cards[newIndex], cards[i - 1]];
    }
}

class Deck {
    constructor() {
        initDeck();
        shuffleCards();
    }

    getCards() {
        return _getDeckCards();
    }

    next() {
        return cards.pop();
    }
}

module.exports = Deck;