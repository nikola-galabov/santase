var Deck = require('./Deck');

class Game {
    constructor(cards, player1, player2) {
        this.connectedPlayers = 0;
        if(player1) {
            this.addPlayer(player1);
        }

        if(player2) {
            this.addPlayer(player2);
        }
        
        this.deck = new Deck(cards);
        this.gameSuit;
        this.currentHand = {};
        this.pastHands = [];
        this.winner;
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

    addPlayer(player) {
        this.connectedPlayers++;
        if(!this.player1) {
            this.player1 = player;
            this.playerOnTurn = this.player1;
            this.player1.isOnTurn = true;

            return this;
        }

        this.player2 = player;

        return this;
    }

    getTheOtherPlayer(id) {
        if(this.player1 && this.player1.id === id) {
            return this.player2;
        }

        return this.player1;
    }

    removePlayer(id) {
        if(this.player1 && this.player1.id === id) {
            this.connectedPlayers--;
            this.player1 = undefined;

            return this;
        }

        if(this.player2 && this.player2.id === id) {
            this.connectedPlayers--;
            this.player2 = undefined;

            return this;
        }

        return this;
    }

    getPlayerById(id) {
        if(this.player1 && this.player1.id === id) {
            return this.player1;
        }

        return this.player2;
    }

    nextHand() {
        // the player on turn gives a card
        this.currentHand = {};
        this.currentHand[this.playerOnTurn.id] = this.playerTurn(this.playerOnTurn);

        // the other player gives a card
        this.playerOnTurn = (this.playerOnTurn === this.player1) ? this.player2 : this.player1;
        this.currentHand[this.playerOnTurn.id] = this.playerTurn(this.playerOnTurn);

        // save the hand
        this.pastHands.push(this.currentHand);

        // check the winner
        this.updateResult(this.currentHand);
        this.currentHand = {};
        return this.currentHand;
    }

    updateResult(hand) {
        var winner, looser, winningCard, cards, socketId, winningCard, points;
        
        // get only the cards from the object Object.values(hand); - not supported in this version
        cards = [];
        for(socketId in hand) {
            cards.push(hand[socketId]);
        }

        // get the stronger card 
        winningCard = this.deck.compareCards(cards[0], cards[1], this.gameSuit);
        
        for(socketId in hand) {
            // if this is not the winning card we will continue the loop
            if(hand[socketId] !== winningCard) {
                continue;
            }

            winner = this.player2;
            looser = this.player1;
            if(this.player1.id === socketId) {
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

        // update variables
        this.playerOnTurn = winner;
        winner.isOnTurn = true;
        looser.isOnTurn = false;
        
        if(winner.points >= 66) {
            this.winner = winner;
        }

        this.pastHands.push(hand);
        
        return this;
    }

    playerTurn(player) {
        var theCard;
        if(this.playerOnTurn.getCards().length > 0) {
            theCard = this.playerOnTurn.play();
        }

        return theCard;
    }

    checkForTwenty(player, card) {
        if(
            player.announcements && 
            player.announcements.hasTwenty && 
            player.announcements.twenty.suits.indexOf(card.suit) !== -1 &&
            (card.value === 'K' || card.value === 'Q')
        ) {
            player.addPoints(20);
        }

        return this;
    }

    checkForForthy(player, card, suit) {
        if(
            player.announcements && 
            player.announcements.hasForthy && 
            player.announcements.forthy.suit === card.suit &&
            (card.value === 'K' || card.value === 'Q')
        ) {
            player.addPoints(40);
        }
    }
}

module.exports = Game;