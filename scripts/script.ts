var $: any;
/*
 --------------------------------Enums--------------------------------
*/

const winnerStatus: string[] = [ 'Player1', 'Player2',  'Player3', 'Player4', 'Draw' ];
const suits: string[] = [ 'Hearts', 'Clubs', 'Diamonds', 'Spades' ];
const values: string[] = ['Ace', 'King', 'Queen', 'Jack', 'Nine', 'Eight', 'Seven', 'Six',
    'Five', 'Four', 'Three', 'Two'];
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
    ClearHand = () => {
        this.cards = [];
    }
}

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