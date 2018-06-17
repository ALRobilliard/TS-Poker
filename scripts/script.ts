var $: any;
/*
 --------------------------------Enums--------------------------------
*/

const winnerStatus: string[] = [ 'Player1', 'Player2',  'Player3', 'Player4', 'Draw' ];
const suits: string[] = [ 'Hearts', 'Clubs', 'Diamonds', 'Spades' ];
const values: string[] = [ 'Ace', 'King', 'Queen', 'Jack', 'Ten', 'Nine', 'Eight', 'Seven', 'Six',
    'Five', 'Four', 'Three', 'Two' ];
enum handType { RoyalFlush, StraightFlush, FourOfAKind, FullHouse, Flush, Straight, 
    ThreeOfAKind, TwoPairs, Pair, HighCard };
enum PlayerStatus { InGame, Folded, Out };

/*
 --------------------------------Classes------------------------------
*/

class Card {
    value: string;
    numValue: number;
    suit: string;
    style: string;

    constructor(value: string, suit: string) {
        this.value = value;
        this.numValue = GetNumericValue(value);
        this.suit = suit;
        this.style = `card ${GetCardStylingValue(value)} card-${suit.toLowerCase()}`;
    }
}

class Player {
    points: number;
    status: PlayerStatus;
    cards: Card[];
    hand: Hand;

    constructor(points: number, cards: Card[]) {
        this.points = points;
        this.status = PlayerStatus.InGame;
        this.cards = cards;
    }
    Check = () => {

    }
    Bet = (amount: number) => {
        potValue += amount;
        this.points -= amount;
    }
    Fold = () => {
        this.status = PlayerStatus.Folded;
    };
    CheckPointBalance = () => {
        if (this.points <= 0) {
            this.status = PlayerStatus.Out;
        }
    }
    ClearCards = () => {
        this.cards = [];
    }
}

class Hand {
    type: handType;
    max1: number;
    max2: number;
    runStart: number;
    flush: boolean;

    constructor(cards: Card[]) {
        if (CheckPair(cards) !== -1) {
            this.type = handType.Pair;
            this.max1 = cards[1].numValue;
        } else {
            this.type = handType.HighCard;
            this.max1 = CheckHighest(cards);
        }
    }
    CheckHand = (cards: Card[]) => {
        switch (cards.length) {
            case 5:
                let isFlush = CheckFlush(cards);
                let straight = CheckStraight(cards);
                // Royal Flush.
                if (straight === 10 && isFlush) {
                    this.type = handType.RoyalFlush;
                    this.runStart = straight;
                // Straight Flush.
                } else if (straight !== -1 && isFlush) {
                    this.type = handType.StraightFlush;
                    this.runStart = straight;
                // Four of a Kind.
                } else if (CheckFour(cards) !== -1) {
                    this.type = handType.FourOfAKind;
                    this.max1 = CheckFour(cards);
                // Full House.
                } else if (CheckTriple(cards) !== -1 && CheckPair(cards, CheckTriple(cards)) !== -1) {
                    this.type = handType.FullHouse;
                    this.max1 = CheckTriple(cards);
                    this.max2 = CheckPair(cards, CheckTriple(cards));
                // Flush.
                } else if (isFlush) {
                    this.type = handType.Flush;
                // Straight.
                } else if (straight !== -1) {
                    this.type = handType.Straight;
                    this.runStart = straight;
                // Three of a Kind.
                } else if (CheckTriple(cards) !== -1) {
                    this.type = handType.ThreeOfAKind;
                    this.max1 = CheckTriple(cards);
                // Two Pairs.
                } else if (CheckPair (cards) !== -1 && CheckPair(cards, CheckPair(cards)) !== -1) {
                    this.type = handType.TwoPairs;
                    this.max1 = CheckPair(cards);
                    this.max2 = CheckPair(cards, CheckPair(cards));
                // Pair.
                } else if (CheckPair(cards) !== -1) {
                    this.type = handType.Pair
                    this.max1 = CheckPair(cards);
                // High Card.
                } else {
                    this.type = handType.HighCard;
                    this.max1 = CheckHighest(cards);
                }
                break;
            case 4:
                // Four of a Kind.
                if (CheckFour(cards) !== -1) {
                    this.type = handType.FourOfAKind;
                    this.max1 = CheckFour(cards);
                // Three of a Kind.
                } else if (CheckTriple(cards) !== -1) {
                    this.type = handType.ThreeOfAKind;
                    this.max1 = CheckTriple(cards);
                // Two Pairs.
                } else if (CheckPair (cards) !== -1 && CheckPair(cards, CheckPair(cards)) !== -1) {
                    this.type = handType.TwoPairs;
                    this.max1 = CheckPair(cards);
                    this.max2 = CheckPair(cards, CheckPair(cards));
                // Pair.
                } else if (CheckPair(cards) !== -1) {
                    this.type = handType.Pair
                    this.max1 = CheckPair(cards);
                // High Card.
                } else {
                    this.type = handType.HighCard;
                    this.max1 = CheckHighest(cards);
                }
                break;
            case 3:
                // Three of a Kind.
                if (CheckTriple(cards) !== -1) {
                    this.type = handType.ThreeOfAKind;
                    this.max1 = CheckTriple(cards);
                // Two Pairs.
                } else if (CheckPair (cards) !== -1 && CheckPair(cards, CheckPair(cards)) !== -1) {
                    this.type = handType.TwoPairs;
                    this.max1 = CheckPair(cards);
                    this.max2 = CheckPair(cards, CheckPair(cards));
                // Pair.
                } else if (CheckPair(cards) !== -1) {
                    this.type = handType.Pair
                    this.max1 = CheckPair(cards);
                // High Card.
                } else {
                    this.type = handType.HighCard;
                    this.max1 = CheckHighest(cards);
                }
                break;
            default:
                // Pair.
                if (CheckPair(cards) !== -1) {
                    this.type = handType.Pair
                    this.max1 = CheckPair(cards);
                // High Card.
                } else {
                    this.type = handType.HighCard;
                    this.max1 = CheckHighest(cards);
                }
                break;
        }
    }
}

/*
 -----------------------------Winning States--------------------------
*/

let RoyalFlush: Card[] = []; // A, K, Q, J, 10 - all same suit
let StraightFlush: Card[] = []; // Run of 5 cards - all same suit
let FourOfAKind: Card[] = []; // All four cards of same rank
let FullHouse: Card[] = []; // Triple and a pair
let Flush: Card[] = []; // 5 cards of the same suit
let Straight: Card[] = [] // Run of 5 cards - any suit
let ThreeOfAKind: Card[] = [] // Three cards of the same rank
let TwoPairs: Card[] = [] // Two pairs of the same rank
let Pair: Card[] = [] // Two cards of the same rank
let HighCard: Card; // Play your highest cards if none of the others can be achieved

/*
 --------------------------------Scripts------------------------------
*/

// DOM variables
let textArea = $('#text-area'),
    newGameButton = $('#new-game-button'),
    checkButton = $('#check-button'),
    callButton = $('#call-button'),
    betButton = $('#bet-button'),
    raiseButton = $('#raise-button'),
    foldButton = $('#fold-button'),
    allInButton = $('#all-in-button'),
    betInput = $('#bet-value');

// Game variables
let gameStarted: boolean = false,
    gameOver: boolean = false,
    roundOver: boolean = false,
    winner: Player = null,
    numberOfPlayers: number = 4;

let startingPlayer: number;
let playerIndex: number;
let potValue: number;
let lastBet: number;

let deck: Card[] = [];
let players: Player[] = [];
let player1: Player;
let player2: Player;
let player3: Player;
let player4: Player;

HideGameButtons();

function NewGame(): void {
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
    for(let i = 0; i < numberOfPlayers; i++) {
        players.push(new Player(200, [ GetNextCard(), GetNextCard() ]));
    }
    ShowGameButtons();
    newGameButton.hide();

    while (!roundOver) {
        if(playerIndex == 0) {
            ShowGameButtons();
            roundOver = true;
        } else {
            HideGameButtons();
            PlayAI(players[playerIndex]);
        }
    }
}

function CreateDeck(): Card[] {
    let deck: Card[] = [];
    for (let suit of suits) {
        for (let value of values) {
            let card = new Card(value, suit);
            deck.push(card);
        }
    }
    return deck;
}

function ShuffleDeck(cards: Card[]): Card[] {
    for (let i = 0; i < cards.length; i++) {
        let swapIdx = Math.floor(Math.random() * cards.length);
        let tmp = cards[swapIdx];
        cards[swapIdx] = cards[i];
        cards[i] = tmp;
    }
    return cards;
}

function GetNextCard(): Card {
    return deck.shift();
}

function PlayAI(player: Player): void {
    playerIndex = ++playerIndex % 4;
}

function ShowGameButtons(): void {
    checkButton.show();
    callButton.show();
    betButton.show();
    raiseButton.show();
    foldButton.show();
    allInButton.show();
    betInput.show();
}

function HideGameButtons(): void {
    checkButton.hide();
    callButton.hide();
    betButton.hide();
    raiseButton.hide();
    foldButton.hide();
    allInButton.hide();
    betInput.hide();
}

newGameButton.on('click', NewGame);
checkButton.on('click', function() {
    players[0].Check();
});
callButton.on('click', function() {
    players[0].Bet(lastBet);
});
betButton.on('click', function() {
    players[0].Bet(parseFloat(betInput.val()));
    betInput.val('');
});
raiseButton.on('click', function() {
    players[0].Bet(parseFloat(betInput.val()));
    betInput.val('');
});
foldButton.on('click', function() {
    players[0].Fold();
});
allInButton.on('click', function() {
    players[0].Bet(players[0].points);
});

function GetNumericValue(value: string): number {
    switch(value) {
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
    };
}

function GetCardStylingValue(value: string): string {
    switch(value) {
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

function CheckHighest(cards: Card[]): number {
    let maxCard: number = -1;
    for (let card of cards) {
        if (card.numValue > maxCard) {
            maxCard = card.numValue;
        }
    }
    return maxCard;
}

function CheckPair(cards: Card[], firstPair?: number): number {
    let maxPair: number = -1;
    firstPair = firstPair || -1;
    for (let i = 0; i < cards.length; i++) {
        for (let j = 1; j < cards.length; j++) {
            if (i !== j) {
                if(cards[i].numValue === cards[j].numValue && cards[i].numValue > maxPair && cards[i].numValue !== firstPair) {
                    maxPair = cards[i].numValue;
                }
            }
        }
    }
    return maxPair;
}

function CheckTriple(cards: Card[]): number {
    let maxTriple: number = -1;
    for (let i = 0; i < cards.length; i++) {
        for (let j = 1; j < cards.length; j++) {
            for (let k = 2; k < cards.length; k++) {
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

function CheckStraight(cards: Card[]): number {
    let maxStraightStart: number = -1;
    let arr: number[] = [];
    if (cards.length !== 5)
        return maxStraightStart;
    for (let card of cards) {
        arr.push(card.numValue);
        arr.sort((a, b) => a - b);
    }
    if (arr.lastValue() - arr[0] === 4) {
        maxStraightStart = arr.lastValue();
    }
    return maxStraightStart;
}

function CheckFlush(cards: Card[]): boolean {
    let isFlush = true;
    let prevSuit: string;
    if (cards.length !== 5)
        return false;
    for (let card of cards) {
        if (prevSuit != null && card.suit !== prevSuit) {
            isFlush = false;
            break;
        } else {
            prevSuit = card.suit;
        }
    }
    return isFlush;
}

function CheckFour(cards: Card[]): number {
    let maxFour: number = -1;
    let arr: number[] = [];
    if (cards.length < 4) {
        return maxFour;
    }
    for (let card of cards) {
        arr.push(card.numValue);
    }
    arr.sort((a, b) => a - b);
    if (arr[0] === arr[3] || (cards.length === 5 && arr[1] === arr[4])) {
        maxFour = arr[1];
    }
    return maxFour;
}

interface Array<T> {
    lastValue();
}

Array.prototype.lastValue = function () {
    return this[this.length - 1];
}