class Card {
    constructor(value, suit) {
        this.value = value;
        this.suit = suit;
        this.id = `${this.value}${this.suit}`;
        this.color = 'black';
        if(this.suit === '♥' || this.suit === '♦') {
            this.color = 'red';
        }
    }

    toString() {
        return `${this.value}${this.suit}`;
    }
}

module.exports = Card;