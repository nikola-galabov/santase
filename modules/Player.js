class Player {
    constructor(name) {
        this.name = name;
        this.points = 0;
        this.cards = [];
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

    addPoints(points) {
        this.points += points;
    }
}

module.exports = Player;