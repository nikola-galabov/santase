var socket = io.connect('http://localhost:1948');
var myTurn = false; // TODO - remove the global variable

socket.on('getCards', function (data) {
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

function printPlayedCard(card) {
    $('#other-player-cards .card').last().remove();
    var playedCardTemplate = $('#played-cards-template').html();
    Mustache.parse(playedCardTemplate);   // optional, speeds up future uses
    var rendered = Mustache.render(playedCardTemplate, {card: card});
    $('#played-cards').html(rendered);
}

// TODO rename the function
function renderCards(data) {
    myTurn = data.isOnTurn;
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