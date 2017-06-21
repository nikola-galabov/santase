class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.points = 0;
        this.cards = [];
        this.isOnTurn = false;
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
        var theCard, theCardIndex;
        
        var filteredCards = this.cards.filter(function(card, index){
            if(card.id === id) {
                theCardIndex = index;

                return true;
            }

            return false;
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
}

module.exports = Player;