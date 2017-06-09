var Deck = require('./Deck');

class Game {
    constructor(player1, player2, cards) {
        this.player1 = player1;
        this.player2 = player2;
        this.playerOnTurn = player1;
        this.deck = new Deck(cards);
        this.gameSuit;
        this.currentHand = {};
        this.pastHands = [];
    }

    // give six cards to both of the players
    // get the suit
    init() {
        var index, cards;

        for (index = 0; index < 6; index += 1) {
            this.player1.takeCard(this.deck.next());
            this.player2.takeCard(this.deck.next());
        }

        cards = this.deck.getCards();
        this.gameSuit = cards[0];
    }

    nextHand() {
        // the player on turn gives a card
        this.currentHand[this.playerOnTurn.name] = this.playerTurn(this.playerOnTurn);

        // the other player gives a card
        this.playerOnTurn = (this.playerOnTurn === this.player1) ? this.player2 : this.player1;
        this.currentHand[this.playerOnTurn.name] = this.playerTurn(this.playerOnTurn);

        // save the hand
        this.pastHands.push(this.currentHand);

        // check the winner
        this.playerOnTurn = this.checkResult(this.currentHand);

        return this.currentHand;
    }

    checkResult(hand) {
        var winner, looser, winningCard, cards, nickname, winningCard, points;
        
        // get only the cards from the object Object.values(hand); - not supported in this version
        cards = [];
        for(nickname in hand) {
            cards.push(hand[nickname]);
        }

        // get the stronger card 
        winningCard = this.deck.compareCards(cards[0], cards[1], this.gameSuit);
        for(nickname in hand) {
            // if this is not the winning card we will continue the loop
            if(hand[nickname] !== winningCard) {
                continue;
            }

            winner = this.player2;
            looser = this.player1;
            if(this.player1.name === nickname) {
                winner = this.player1;
                looser = this.player2;
            }
        }

        if(this.deck.getCards().length > 0) {
            winner.takeCard(this.deck.next());
            looser.takeCard(this.deck.next());            
        }

        // add the score to the winner
        points = this.deck.getPoints(cards);
        winner.addPoints(points);

        return winner;
    }

    playerTurn(player) {
        var theCard;
        if(this.playerOnTurn.getCards().length > 0) {
            theCard = this.playerOnTurn.play();
        }

        return theCard;
    }
}

module.exports = Game;