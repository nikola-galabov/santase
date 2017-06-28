$(function(){
    var socket = io.connect('http://localhost:1948'),
        myTurn = false,
        currentlyFirst = false,
        pastHandsNumber = 0,
        canChangeCard = false,
        isGameClosed = false, // TODO There has to be backend validation for this!!!
        canCloseGame = false,
        otherPlayerCard,
        announcements,
        gameSuit;

    socket.on('getCards', function (data) {
        announcements = data.announcements;
        gameSuit = data.gameSuit.suit;

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
        var $this = $(this)
            isValidMove = true;

        if(!myTurn) {
            return;
        }

        // check for closed game
        if(isGameClosed) {
            isValidMove = checkPlayerCard($this);
            if(! isValidMove) {
                return alert('You should play a card that matches the suit of your opponent!');
            }
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

    $('#game').on('click', '#close-the-game', function(){  
        socket.emit('closeGame');
    });

    socket.on('myTurn', function(data) {
        // print the other player's card
        otherPlayerCard = data.currentHand[data.otherPlayer];
        printPlayedCard(otherPlayerCard);

        // allow the player to play
        myTurn = data.isOnTurn;
        if(myTurn) {
            $('#player-cards .card').addClass('player-card');
        }
    });

    socket.on('gameIsClosed', function(){
        console.log('game is closed');
        isGameClosed = true;
        $('#close-the-game').remove();
        $('#gameSuit')
            .addClass('closed')
            .removeClass('changable');
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
        canCloseGame = data.canCloseGame;
        isGameClosed = data.isClosed;
        console.log(isGameClosed);
        otherPlayerCard = undefined;

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

        var renderedGameSuit = Mustache.render(gameSuitTemplate, {gameSuit: data.gameSuit, deck: deck, isGameClosed: isGameClosed, cannotCloseGame: !canCloseGame});
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

    // TODO: verify that the player is required to give a stronger card from the requested suit if he has one
    function checkPlayerCard($card) {
        var suits = {};

        if(! otherPlayerCard) {
            return true;
        }
        
        $('#player-cards .card').each(function(i, e) { 
            var cardSuit = $(e).data('suit');

            if(!suits.hasOwnProperty(cardSuit)) {
                suits[cardSuit] = 0;
            }

            suits[cardSuit]++;
        });

        // the player has a card of requested suit, but is trying to play a card from other suit
        if(
            $card.data('suit') !== otherPlayerCard.suit &&
            suits.hasOwnProperty(otherPlayerCard.suit)
        ) {
            return false;
        }

        // the player has not a card of requested suit, but he has a card from the gam suit and he is required to use it
        if(
            $card.data('suit') !== otherPlayerCard.suit &&
            $card.data('suit') !== gameSuit &&
            suits.hasOwnProperty(gameSuit)
        ) {
            return false;
        }

        return true;
    }
});