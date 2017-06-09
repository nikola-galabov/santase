var Deck = require('./Deck');

class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.deck = new Deck();
        this.theSuit;
    }

    // give six cards to both of the players
    // get the strong suit
    start() {
        for (var index = 0; index < 6; index+=1) {
            this.player1.takeCard(this.deck.next());
            this.player2.takeCard(this.deck.next());
        }

        this.theSuit = this.deck.next();
    }
}

module.exports = Game;