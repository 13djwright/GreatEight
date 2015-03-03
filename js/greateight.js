function Card(value) {
	this.value = value;
	this.image = "./images/"+value+".png";
	this.visible;
}

function Deck() {
	this.cards = new Array();
	this.cardsPlayed = new Array();
	this.cardsUsed = 0;
	this.makeDeck = makeDeck;
	this.shuffle = shuffleDeck;
	this.deal = dealCard;
	this.cardsLeft = getCardsLeft;
}

function Player(isHuman) {
	this.isHuman = isHuman;
	this.canPlay = true;
	this.playedCards = new Array(16);
	this.isTargetable = true;
	this.currentCard;
	this.newCard;
}

function Game() {
	//game needs a deck created and shuffled
	this.deck = new Deck();
	this.deck.makeDeck();
	this.deck.shuffle(3);
	//deal off top card
	this.deck.cardsUsed++;
	//create the players
	this.players = new Array(4);
	this.players[0] = new Player(true);
	for(var i = 1; i < 4; i++) {
		this.players[i] = new Player(false);
	}
	//choose a player to start with
	this.activePlayer = Math.floor(Math.random()*4);
	//deal each player their first card
	for(var i = 0; i < 4; i++) {
		//console.log((i+this.activePlayer)%4);
		this.players[(i+this.activePlayer)%4].currentCard = this.deck.deal();
	}
	//now the game continues in a loop until it is over.
}

/*
makeDeck(): Initializes a standard deck of playing cards
*/
function makeDeck() {
	this.cards = new Array(16);
	for (var i = 0; i < 16; i++) {
		if (i<5) {
			this.cards[i] = new Card(1);
		}
		
		if (i >= 5 && i < 7) {
			this.cards[i] = new Card(2);
		}
		
		if (i >= 7 && i < 9) {
			this.cards[i] = new Card(3);
		}
		
		if (i >= 9 && i < 11) {
			this.cards[i] = new Card(4);
		}
		
		if (i >= 11 && i < 13) {
			this.cards[i] = new Card(5);
		}
		
		if (i == 13) {
			this.cards[i] = new Card(6);
		}
		
		if (i == 14) { 
			this.cards[i] = new Card(7);
		}
		
		if (i == 15) {
			this.cards[i] = new Card(8);
		}
	}
	this.cardsUsed = 0;
}

/*
shuffleDeck(n): Shuffles a deck of cards 'n' times
*/
function shuffleDeck(n) {
	var i, j, k;
	var temp;
	
	for (i = 0; i < n; i++) {
		for (j = 0; j < this.cards.length; j++) {
			k = Math.floor(Math.random() * this.cards.length);
			temp = this.cards[j];
			this.cards[j] = this.cards[k];
			this.cards[k] = temp;			
		}
	}
}
/*
dealCard(): returns the card 
*/
function dealCard() {
	if (this.cardsLeft() > 0) {
		this.cardsUsed++;
		return this.cards[this.cardsUsed-1];
	}
	else {
		return null;
	}
}

function getCardsLeft() {
	return this.cards.length - this.cardsUsed
}





