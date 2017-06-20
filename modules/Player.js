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
        var filteredCards = this.cards.filter(function(card){
            return card.id === id;
        });

        if(filteredCards.length !== 1) {
            return undefined
        }

        return filteredCards[0];
    }

    addPoints(points) {
        this.points += points;
    }
}

module.exports = Player;