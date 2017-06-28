class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.points = 0;
        this.cards = [];
        this.isOnTurn = false;
        this.announcements = {
            hasTwenty: false,
            hasForthy: false,
            twenty: {
                suits: []
            },
            forthy: {
                suit: undefined
            }
        };
    }

    takeCard(card) {
        this.cards.push(card);
    }

    play(){
        return this.cards.pop();
    }

    getCards() {
        return this.cards;
    }

    getCard(id) {
        var theCard;
        
        var filteredCards = this.cards.filter(function(card, index){
            return card.id === id;
        });

        if(filteredCards.length !== 1) {
            return undefined
        }

        theCard = filteredCards[0];
        this.cards.splice(this.cards.indexOf(theCard), 1);

        return theCard;
    }

    addPoints(points) {
        this.points += points;
    }

    canChangeCard(gameSuit) {
        var nineOfSuit = this.cards.find(function(card){
            if(card.suit === gameSuit && card.value === '9') {
                return true;
            }
        });

        if(! nineOfSuit) {
            return false;
        }

        return true;
    }

    canCloseGame(numberOfHands) {
        if(numberOfHands === 0 || !this.isOnTurn) {
            return false;
        }

        return true;
    }

    checkCardsForAnnouncements(gameSuit) {
        var kings = [];
        var queens = [];

        // get the kings and queens from the cards
        this.cards.forEach(function(card){
            if(card.value === 'K') {
                kings.push(card);
            }

            if(card.value === 'Q') {
                queens.push(card);
            }
        });

        // loop over the kings and check if the player has a queen for the same suit
        kings.forEach(function(king){
            var match = queens.find(function(queen){
                return queen.suit === king.suit;
            });

            // we don't have a match
            if(! match) {
                return;
            }

            // player has 40
            if(gameSuit === king.suit) {
                this.announcements.hasForthy = true;
                this.announcements.forthy.suit = gameSuit;

                return;
            }

            // player has 20
            this.announcements.hasTwenty = true;    
            this.announcements.twenty.suits.push(king.suit);
        }, this);

        return this.announcements;
    }
}

module.exports = Player;