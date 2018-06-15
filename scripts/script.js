var $;
/*
 --------------------------------Enums--------------------------------
*/
var winnerStatus = ['Player1', 'Player2', 'Player3', 'Player4', 'Draw'];
var suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
var values = ['Ace', 'King', 'Queen', 'Jack', 'Nine', 'Eight', 'Seven', 'Six',
    'Five', 'Four', 'Three', 'Two'];
var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus[PlayerStatus["InGame"] = 0] = "InGame";
    PlayerStatus[PlayerStatus["Folded"] = 1] = "Folded";
    PlayerStatus[PlayerStatus["Out"] = 2] = "Out";
})(PlayerStatus || (PlayerStatus = {}));
;
/*
 --------------------------------Classes------------------------------
*/
var Card = /** @class */ (function () {
    function Card(value, suit) {
        this.value = value;
        this.numValue = GetNumericValue(value);
        this.suit = suit;
        this.style = "card " + GetCardStylingValue(value) + " card-" + suit.toLowerCase();
    }
    return Card;
}());
var Player = /** @class */ (function () {
    function Player(points, cards) {
        var _this = this;
        this.Check = function () {
        };
        this.Bet = function (amount) {
            potValue += amount;
            _this.points -= amount;
        };
        this.Fold = function () {
            _this.status = PlayerStatus.Folded;
        };
        this.CheckPointBalance = function () {
            if (_this.points <= 0) {
                _this.status = PlayerStatus.Out;
            }
        };
        this.ClearHand = function () {
            _this.cards = [];
        };
        this.points = points;
        this.status = PlayerStatus.InGame;
        this.cards = cards;
    }
    return Player;
}());
/*
 --------------------------------Scripts------------------------------
*/
// DOM variables
var textArea = $('#text-area'), newGameButton = $('#new-game-button'), checkButton = $('#check-button'), callButton = $('#call-button'), betButton = $('#bet-button'), raiseButton = $('#raise-button'), foldButton = $('#fold-button'), allInButton = $('#all-in-button'), betInput = $('#bet-value');
// Game variables
var gameStarted = false, gameOver = false, roundOver = false, winner = null, numberOfPlayers = 4;
var startingPlayer;
var playerIndex;
var potValue;
var lastBet;
var deck = [];
var players = [];
var player1;
var player2;
var player3;
var player4;
HideGameButtons();
function NewGame() {
    gameStarted = true;
    gameOver = false;
    roundOver = false;
    winner = null;
    potValue = 0;
    lastBet = 0;
    deck = ShuffleDeck(CreateDeck());
    //startingPlayer = Math.floor(Math.random() * (numberOfPlayers - 1));
    startingPlayer = 0;
    playerIndex = startingPlayer;
    players = [];
    for (var i = 0; i < numberOfPlayers; i++) {
        players.push(new Player(200, [GetNextCard(), GetNextCard()]));
    }
    ShowGameButtons();
    newGameButton.hide();
    while (!roundOver) {
        if (playerIndex == 0) {
            ShowGameButtons();
            roundOver = true;
        }
        else {
            HideGameButtons();
            PlayAI(players[playerIndex]);
        }
    }
}
function CreateDeck() {
    var deck = [];
    for (var _i = 0, suits_1 = suits; _i < suits_1.length; _i++) {
        var suit = suits_1[_i];
        for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
            var value = values_1[_a];
            var card = new Card(value, suit);
            deck.push(card);
        }
    }
    return deck;
}
function ShuffleDeck(cards) {
    for (var i = 0; i < cards.length; i++) {
        var swapIdx = Math.floor(Math.random() * cards.length);
        var tmp = cards[swapIdx];
        cards[swapIdx] = cards[i];
        cards[i] = tmp;
    }
    return cards;
}
function GetNextCard() {
    return deck.shift();
}
function PlayAI(player) {
    playerIndex = ++playerIndex % 4;
}
function ShowGameButtons() {
    checkButton.show();
    callButton.show();
    betButton.show();
    raiseButton.show();
    foldButton.show();
    allInButton.show();
    betInput.show();
}
function HideGameButtons() {
    checkButton.hide();
    callButton.hide();
    betButton.hide();
    raiseButton.hide();
    foldButton.hide();
    allInButton.hide();
    betInput.hide();
}
newGameButton.on('click', NewGame);
checkButton.on('click', function () {
    players[0].Check();
});
callButton.on('click', function () {
    players[0].Bet(lastBet);
});
betButton.on('click', function () {
    players[0].Bet(parseFloat(betInput.val()));
    betInput.val('');
});
raiseButton.on('click', function () {
    players[0].Bet(parseFloat(betInput.val()));
    betInput.val('');
});
foldButton.on('click', function () {
    players[0].Fold();
});
allInButton.on('click', function () {
    players[0].Bet(players[0].points);
});
function GetNumericValue(value) {
    switch (value) {
        case 'Ace':
            return 1;
        case 'Two':
            return 2;
        case 'Three':
            return 3;
        case 'Four':
            return 4;
        case 'Five':
            return 5;
        case 'Six':
            return 6;
        case 'Seven':
            return 7;
        case 'Eight':
            return 8;
        case 'Nine':
            return 9;
        default:
            return 10;
    }
    ;
}
function GetCardStylingValue(value) {
    switch (value) {
        case 'Ace':
            return 'card-a';
        case 'Two':
            return 'card-2';
        case 'Three':
            return 'card-3';
        case 'Four':
            return 'card-4';
        case 'Five':
            return 'card-5';
        case 'Six':
            return 'card-6';
        case 'Seven':
            return 'card-7';
        case 'Eight':
            return 'card-8';
        case 'Nine':
            return 'card-9';
        case 'Jack':
            return 'card-j';
        case 'Queen':
            return 'card-q';
        case 'King':
            return 'card-k';
        default:
            return '';
    }
}
