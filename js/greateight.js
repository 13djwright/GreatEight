function Card(value) {
	this.value = value;
	this.image = "./images/"+value+".png";
	this.width = 58;
	this.height = 63;
	this.alt = "Playing Card";
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

function Player(isHuman, num) {
	this.playerNum = num;
	this.isHuman = isHuman;
	this.canPlay = true;
	this.playedCards = new Array(16);
	this.isTargetable = true;
	this.currentCard;
	this.newCard;
	this.takeTurn = takeTurn;
}

function Game() {
	this.gameOver = false;
	//game needs a deck created and shuffled
	this.deck = new Deck();
	this.deck.makeDeck();
	this.deck.shuffle(3);
	//deal off top card
	this.deck.cardsUsed++;
	//create the players
	this.players = new Array(4);
	this.players[0] = new Player(true, 0);
	for(var i = 1; i < 4; i++) {
		this.players[i] = new Player(false, i);
	}
	this.playersLeft = playersLeftInPlay(this.players);
	console.log("playersLeft: " + this.playersLeft);
	addToGameLog("playersLeft: " + this.playersLeft);
	//choose a player to start with
	this.activePlayer = 0; //Player 1 always goes first, otherwise use Math.floor(Math.random()*4)
	
	//deal each player their first card
	for(var i = 0; i < 4; i++) {
		//the following is used for when its random who goes first but works no matter what
		this.players[(i+this.activePlayer)%4].currentCard = this.deck.deal();
	}
	//if player 1 goes first, deal them another card.
	if(this.activePlayer === 0) {
		this.players[0].newCard = this.deck.deal();
	}
	else {
		//bots go first.
	}
	
	var element1 = document.getElementById("playerCard1");
	element1.setAttribute("src", this.players[0].currentCard.image);
	element1 = document.getElementById("playerCard2");
	element1.setAttribute("src", this.players[0].newCard.image);
	//here the game is set up and needs to be updated a player selects a card
}

// Function for displaying all of the player's cards
function showPlayerCards( card ) {
	this.card1 = game.players[0].currentCard;
	this.card2 = game.players[0].newCard;
	
	var cardURL;
	if( card = 1 )
		cardURL = card1.image;
	else if( card = 2 )
		cardURL = card2.image;
		
	var element1 = document.getElementById("playerCard1");	
	
	element1.setAttribute("src", cardURL);
}

// Function for displaying a card through HTML
function showCard( card ) {
	var img = document.createElement("img");
	img.src = card.image;
	img.width = card.width;
	img.height = card.height;
	img.alt = card.alt;
	
	document.body.appendChild(img);
}
/*
playCard(cardNum): cardNum - used to tell what card was clicked.
initial advance of the game "loop" where the player selects the card to play
along with any additional information needed, and then gets handed off to the bots
to play.
*/
function playCard(cardNum) {
	var card;
	if(cardNum === 0) {
		card = game.players[0].currentCard;
	}
	else if(cardNum === 1) {
		card = game.players[0].newCard;
	}
	else {
		console.log("something broken in playCard()");
	}
	//depending on the value of the card depends on the 
	
}

/*
takeTurn(): each player must take a turn
*/
function takeTurn() {
	
	if(this.isHuman) {
		//alert("Your Turn");
	}
	else {
		setTimeout(function(){}, 2000); //bot waits 2 seconds before playing
	}
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

/*
playersLeftInPlay: Return the total amount of players left in play
*/
function playersLeftInPlay(params) {
	var count = 0; 
	for(var i = 0; i < params.length; i++) {
		if(params[i].canPlay)
			count++;
	}
	return count;
}






