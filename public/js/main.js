var socket = io.connect('http://localhost:1948');
var myTurn = false; // TODO - remove the global variables
var currentlyFirst = false;
var pastHandsNumber = 0;
var announcements;
var canChangeCard = false;

socket.on('getCards', function (data) {
    announcements = data.announcements;

    if(! data.winner) {
        renderCards(data);

        return;
    }
    
    if(data.winner === socket.id) {
        alert('You win :)');

        return;
    }

    alert('You loose :(');
});

$('#game').on('click', '#gameSuit.changable', function() {
    var $this = $(this);
    
    if(canChangeCard) {
       socket.emit('changeGameSuit', $this.data('id'));
    }
});

$('#game').on('click', '.card.player-card', function() {
    var $this = $(this);
    if(!myTurn) {
        return;
    }

    // do not allow the player to play a second card
    myTurn = false;
    $('#player-cards .card').removeClass('player-card');
    
    if(currentlyFirst && pastHandsNumber > 0) {
        checkForAnnouncements($this);
    }

    // send the card to the server
    $this.addClass('played-card');
    socket.emit('playCard', $this.data('id'));
});

socket.on('myTurn', function(data) {
    // print the other player's card
    var otherPlayerCard = data.currentHand[data.otherPlayer];
    printPlayedCard(otherPlayerCard);

    // allow the player to play
    myTurn = data.isOnTurn;
    if(myTurn) {
        $('#player-cards .card').addClass('player-card');
    }
});

function checkForAnnouncements($card) {
    // TODO render announcements
    // check for 40
    if(
        announcements && 
        announcements.hasForthy && 
        announcements.forthy.suit === $card.data('suit') &&
        ($card.data('value') === 'K' || $card.data('value') === 'Q')
    ) {
        console.log('+40');
    }

    // check for 20
    if(
        announcements && 
        announcements.hasTwenty && 
        announcements.twenty.suits.indexOf($card.data('suit')) !== -1 &&
        ($card.data('value') === 'K' || $card.data('value') === 'Q')
    ) {
        console.log('+20');  
    }
}

function printPlayedCard(card) {
    $('#other-player-cards .card').last().remove();
    var playedCardTemplate = $('#played-cards-template').html();
    Mustache.parse(playedCardTemplate);   // optional, speeds up future uses
    var rendered = Mustache.render(playedCardTemplate, {card: card});
    $('#played-cards').html(rendered);
}

// TODO rename the function and refactore it
function renderCards(data) {
    canChangeCard = data.canChangeCard;
    myTurn = data.isOnTurn;
    currentlyFirst = data.currentlyFirst;
    pastHandsNumber = data.pastHandsNumber;
    // player cards
    var cardsTemplate = $('#cards-template').html();
    Mustache.parse(cardsTemplate);   // optional, speeds up future uses
    var rendered = Mustache.render(cardsTemplate, {cards: data.cards, gameSuit: data.gameSuit, isOnTurn: data.isOnTurn});
    $('#player-cards').html(rendered);

    // game suit and deck
    var gameSuitTemplate = $('#game-suit-template').html();
    Mustache.parse(gameSuitTemplate);   // optional, speeds up future uses
    var deck = '';
    for(var i = 0; i < data.cardsInDeck - 1; i++) {
        deck += '<div class="card back deck-card">';
    }

    for(var i = 0; i < data.cardsInDeck - 1; i++) {
        deck += '</div>';
    }

    var renderedGameSuit = Mustache.render(gameSuitTemplate, {gameSuit: data.gameSuit, deck: deck});
    $('#gameSuitAndDeck').html(renderedGameSuit);
    if(data.cardsInDeck === 0) {
        $('#gameSuitAndDeck').html('');
    }
    if(canChangeCard) {
        $('#gameSuit').addClass('changable');
    }

    // other player cards
    var otherPlayerCards = '';
    data.cards.forEach(function() {
       otherPlayerCards += '<div class="card back"></div>';
    });
    $('#other-player-cards').html(otherPlayerCards);
    
    // clean the playground
    $('#played-cards').html('');

    // update the score
    var scoreTemplate = $('#score-template').html();
    Mustache.parse(scoreTemplate);   // optional, speeds up future uses
    var renderedScore = Mustache.render(scoreTemplate, {myPoints: data.myPoints, otherPlayerPoints: data.otherPlayerPoints});
    $('#score').html(renderedScore);
}