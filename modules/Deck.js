// TODO: refactor this file

var Card = require('./Card');
var cards = [];
var suits = ['♠', '♥', '♦',	'♣'];
var points = {
    '9': 0,
    'J': 2,
    'Q': 3,
    'K': 4,
    '10': 10,
    'A': 11,
};
var suitsSort = {
    '♥': 1,
    '♠': 2, 
    '♦': 3,
    '♣': 4
}
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

function getDeckCards() {
    return cards;
}

function shuffleCards() {
    for (var i = cards.length; i; i--) {
        var newIndex = Math.floor(Math.random() * i);
        [cards[i - 1], cards[newIndex]] = [cards[newIndex], cards[i - 1]];
    }
}

class Deck {
    constructor(testCards) {
        if(!testCards) {
            initDeck();
            shuffleCards();

            return;
        }

        testCards.forEach(function(card) {
            var theCard = new Card(card.value, card.suit);
            cards.push(theCard);
        });
    }

    getCards() {
        return getDeckCards();
    }

    next() {
        return cards.pop();
    }

    sortCards(cards, gameSuit) {
        return cards.sort(function(first, second){
            if(first.suit === gameSuit && second.suit !== gameSuit) {
                return -1;
            }

            if(second.suit === gameSuit && first.suit !== gameSuit) {
                return 1;
            }

            if(suitsSort[first.suit] === suitsSort[second.suit]) {
                return points[first.value] < points[second.value];
            }
            
            return suitsSort[first.suit] > suitsSort[second.suit]
        });
    }

    // return the stronger card
    compareCards(card1, card2, gameSuit) {
        // check the cards suits
        if(card1.suit === gameSuit.suit && card2.suit !== gameSuit.suit) {
            return card1;
        }

        if(card2.suit === gameSuit.suit && card1.suit !== gameSuit.suit) {
            return card2;
        }

        // this is not true !!
        if(card1.suit !== card2.suit) {
            return card1;
        }

        if(points[card1.value] > points[card2.value]) {
            return card1;
        }

        return card2;
    }

    getPoints(card) {
        // console.log(card);
        var totalPoints = 0;
        if(Array.isArray(card)) {
            card.forEach(function(card){
                totalPoints += points[card.value];
            });

            return totalPoints;
        }

        return points[card.value];
    }
}

module.exports = Deck;