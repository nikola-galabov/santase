var socket = io.connect('http://localhost:1948');
var myTurn = false; // TODO - remove the global variable

socket.on('getCards', function (cards) {
    console.log('cards', cards);

    renderCards(cards);
});

$('#game').on('click', '.card.player-card', function() {
    var $this = $(this);
    if(!myTurn) {
        return;
    }

    // do not allow the player to play a second card
    myTurn = false;
    $('#player-cards .card').removeClass('player-card');
    // send the card to the server
    $this.addClass('played-card');
    socket.emit('playCard', $this.data('id'));
});

socket.on('myTurn', function(card) {
    // print the card
    printPlayedCard(card);
    // allow the player to play
    myTurn = true;
    $('#player-cards .card').addClass('player-card');
});

function printPlayedCard(data) {
    $('#other-player-cards .card').last().remove();
    var playedCardTemplate = $('#played-cards-template').html();
    Mustache.parse(playedCardTemplate);   // optional, speeds up future uses
    var rendered = Mustache.render(playedCardTemplate, {card: data.card});
    $('#played-cards').html(rendered);
}

function renderCards(data) {
    myTurn = data.isOnTurn;
    var cardsTemplate = $('#cards-template').html();
    Mustache.parse(cardsTemplate);   // optional, speeds up future uses
    var rendered = Mustache.render(cardsTemplate, {cards: data.cards, gameSuit: data.gameSuit, isOnTurn: data.isOnTurn});
    $('#player-cards').html(rendered);

    var gameSuitTemplate = $('#game-suit-template').html();
    Mustache.parse(gameSuitTemplate);   // optional, speeds up future uses
    var renderedGameSuit = Mustache.render(gameSuitTemplate, {gameSuit: data.gameSuit});
    $('#gameSuit').html(renderedGameSuit);
}