var $;
/*
 --------------------------------Enums--------------------------------
*/
var winnerStatus = ['Player1', 'Player2', 'Player3', 'Player4', 'Draw'];
var suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
var values = ['Ace', 'King', 'Queen', 'Jack', 'Ten', 'Nine', 'Eight', 'Seven', 'Six',
    'Five', 'Four', 'Three', 'Two'];
var handType;
(function (handType) {
    handType[handType["RoyalFlush"] = 0] = "RoyalFlush";
    handType[handType["StraightFlush"] = 1] = "StraightFlush";
    handType[handType["FourOfAKind"] = 2] = "FourOfAKind";
    handType[handType["FullHouse"] = 3] = "FullHouse";
    handType[handType["Flush"] = 4] = "Flush";
    handType[handType["Straight"] = 5] = "Straight";
    handType[handType["ThreeOfAKind"] = 6] = "ThreeOfAKind";
    handType[handType["TwoPairs"] = 7] = "TwoPairs";
    handType[handType["Pair"] = 8] = "Pair";
    handType[handType["HighCard"] = 9] = "HighCard";
})(handType || (handType = {}));
;
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
        this.ClearCards = function () {
            _this.cards = [];
        };
        this.points = points;
        this.status = PlayerStatus.InGame;
        this.cards = cards;
    }
    return Player;
}());
var Hand = /** @class */ (function () {
    function Hand(cards) {
        var _this = this;
        this.CheckHand = function (cards) {
            switch (cards.length) {
                case 5:
                    var isFlush = CheckFlush(cards);
                    var straight = CheckStraight(cards);
                    // Royal Flush.
                    if (straight === 10 && isFlush) {
                        _this.type = handType.RoyalFlush;
                        _this.runStart = straight;
                        // Straight Flush.
                    }
                    else if (straight !== -1 && isFlush) {
                        _this.type = handType.StraightFlush;
                        _this.runStart = straight;
                        // Four of a Kind.
                    }
                    else if (CheckFour(cards) !== -1) {
                        _this.type = handType.FourOfAKind;
                        _this.max1 = CheckFour(cards);
                        // Full House.
                    }
                    else if (CheckTriple(cards) !== -1 && CheckPair(cards, CheckTriple(cards)) !== -1) {
                        _this.type = handType.FullHouse;
                        _this.max1 = CheckTriple(cards);
                        _this.max2 = CheckPair(cards, CheckTriple(cards));
                        // Flush.
                    }
                    else if (isFlush) {
                        _this.type = handType.Flush;
                        // Straight.
                    }
                    else if (straight !== -1) {
                        _this.type = handType.Straight;
                        _this.runStart = straight;
                        // Three of a Kind.
                    }
                    else if (CheckTriple(cards) !== -1) {
                        _this.type = handType.ThreeOfAKind;
                        _this.max1 = CheckTriple(cards);
                        // Two Pairs.
                    }
                    else if (CheckPair(cards) !== -1 && CheckPair(cards, CheckPair(cards)) !== -1) {
                        _this.type = handType.TwoPairs;
                        _this.max1 = CheckPair(cards);
                        _this.max2 = CheckPair(cards, CheckPair(cards));
                        // Pair.
                    }
                    else if (CheckPair(cards) !== -1) {
                        _this.type = handType.Pair;
                        _this.max1 = CheckPair(cards);
                        // High Card.
                    }
                    else {
                        _this.type = handType.HighCard;
                        _this.max1 = CheckHighest(cards);
                    }
                    break;
                case 4:
                    // Four of a Kind.
                    if (CheckFour(cards) !== -1) {
                        _this.type = handType.FourOfAKind;
                        _this.max1 = CheckFour(cards);
                        // Three of a Kind.
                    }
                    else if (CheckTriple(cards) !== -1) {
                        _this.type = handType.ThreeOfAKind;
                        _this.max1 = CheckTriple(cards);
                        // Two Pairs.
                    }
                    else if (CheckPair(cards) !== -1 && CheckPair(cards, CheckPair(cards)) !== -1) {
                        _this.type = handType.TwoPairs;
                        _this.max1 = CheckPair(cards);
                        _this.max2 = CheckPair(cards, CheckPair(cards));
                        // Pair.
                    }
                    else if (CheckPair(cards) !== -1) {
                        _this.type = handType.Pair;
                        _this.max1 = CheckPair(cards);
                        // High Card.
                    }
                    else {
                        _this.type = handType.HighCard;
                        _this.max1 = CheckHighest(cards);
                    }
                    break;
                case 3:
                    // Three of a Kind.
                    if (CheckTriple(cards) !== -1) {
                        _this.type = handType.ThreeOfAKind;
                        _this.max1 = CheckTriple(cards);
                        // Two Pairs.
                    }
                    else if (CheckPair(cards) !== -1 && CheckPair(cards, CheckPair(cards)) !== -1) {
                        _this.type = handType.TwoPairs;
                        _this.max1 = CheckPair(cards);
                        _this.max2 = CheckPair(cards, CheckPair(cards));
                        // Pair.
                    }
                    else if (CheckPair(cards) !== -1) {
                        _this.type = handType.Pair;
                        _this.max1 = CheckPair(cards);
                        // High Card.
                    }
                    else {
                        _this.type = handType.HighCard;
                        _this.max1 = CheckHighest(cards);
                    }
                    break;
                default:
                    // Pair.
                    if (CheckPair(cards) !== -1) {
                        _this.type = handType.Pair;
                        _this.max1 = CheckPair(cards);
                        // High Card.
                    }
                    else {
                        _this.type = handType.HighCard;
                        _this.max1 = CheckHighest(cards);
                    }
                    break;
            }
        };
        if (CheckPair(cards) !== -1) {
            this.type = handType.Pair;
            this.max1 = cards[1].numValue;
        }
        else {
            this.type = handType.HighCard;
            this.max1 = CheckHighest(cards);
        }
    }
    return Hand;
}());
/*
 -----------------------------Winning States--------------------------
*/
var RoyalFlush = []; // A, K, Q, J, 10 - all same suit
var StraightFlush = []; // Run of 5 cards - all same suit
var FourOfAKind = []; // All four cards of same rank
var FullHouse = []; // Triple and a pair
var Flush = []; // 5 cards of the same suit
var Straight = []; // Run of 5 cards - any suit
var ThreeOfAKind = []; // Three cards of the same rank
var TwoPairs = []; // Two pairs of the same rank
var Pair = []; // Two cards of the same rank
var HighCard; // Play your highest cards if none of the others can be achieved
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
        case 'Ten':
            return 10;
        case 'Jack':
            return 11;
        case 'Queen':
            return 12;
        case 'King':
            return 13;
        case 'Ace':
            return 14;
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
        case 'Ten':
            return 'card-10';
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
function CheckHighest(cards) {
    var maxCard = -1;
    for (var _i = 0, cards_1 = cards; _i < cards_1.length; _i++) {
        var card = cards_1[_i];
        if (card.numValue > maxCard) {
            maxCard = card.numValue;
        }
    }
    return maxCard;
}
function CheckPair(cards, firstPair) {
    var maxPair = -1;
    firstPair = firstPair || -1;
    for (var i = 0; i < cards.length; i++) {
        for (var j = 1; j < cards.length; j++) {
            if (i !== j) {
                if (cards[i].numValue === cards[j].numValue && cards[i].numValue > maxPair && cards[i].numValue !== firstPair) {
                    maxPair = cards[i].numValue;
                }
            }
        }
    }
    return maxPair;
}
function CheckTriple(cards) {
    var maxTriple = -1;
    for (var i = 0; i < cards.length; i++) {
        for (var j = 1; j < cards.length; j++) {
            for (var k = 2; k < cards.length; k++) {
                if (i !== j && i !== k && j !== k) {
                    if (cards[i].numValue === cards[j].numValue && cards[i].numValue === cards[k].numValue && cards[i].numValue > maxTriple) {
                        maxTriple = cards[i].numValue;
                    }
                }
            }
        }
    }
    return maxTriple;
}
function CheckStraight(cards) {
    var maxStraightStart = -1;
    var arr = [];
    if (cards.length !== 5)
        return maxStraightStart;
    for (var _i = 0, cards_2 = cards; _i < cards_2.length; _i++) {
        var card = cards_2[_i];
        arr.push(card.numValue);
        arr.sort(function (a, b) { return a - b; });
    }
    if (arr.lastValue() - arr[0] === 4) {
        maxStraightStart = arr.lastValue();
    }
    return maxStraightStart;
}
function CheckFlush(cards) {
    var isFlush = true;
    var prevSuit;
    if (cards.length !== 5)
        return false;
    for (var _i = 0, cards_3 = cards; _i < cards_3.length; _i++) {
        var card = cards_3[_i];
        if (prevSuit != null && card.suit !== prevSuit) {
            isFlush = false;
            break;
        }
        else {
            prevSuit = card.suit;
        }
    }
    return isFlush;
}
function CheckFour(cards) {
    var maxFour = -1;
    var arr = [];
    if (cards.length < 4) {
        return maxFour;
    }
    for (var _i = 0, cards_4 = cards; _i < cards_4.length; _i++) {
        var card = cards_4[_i];
        arr.push(card.numValue);
    }
    arr.sort(function (a, b) { return a - b; });
    if (arr[0] === arr[3] || (cards.length === 5 && arr[1] === arr[4])) {
        maxFour = arr[1];
    }
    return maxFour;
}
Array.prototype.lastValue = function () {
    return this[this.length - 1];
};
