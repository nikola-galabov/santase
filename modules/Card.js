class Card {
    constructor(value, suit) {
        this.value = value;
        this.suit = suit;
        this.id = `${this.value}${this.suit}`;
    }

    toString() {
        return `${this.value}${this.suit}`;
    }
}

module.exports = Card;