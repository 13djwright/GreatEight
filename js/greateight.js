function Card(value) {
	this.value = value;
	this.image = "./images/"+value+".png";
	this.visible;
}

function Deck() {
	this.cards = new Array();
	this.cardsPlayed = new Array();
	
	this.makeDeck = makeDeck;
	this.shuffle = shuffleDeck;
	this.deal = dealCard;
	this.cardsLeft = getCardsLeft;
	
}

/*
makeDeck(): Initializes a standard deck of playing cards
*/
makeDeck() {
	this.cards = new Array(16);
	for(var i = 0; i < 16; i++) {
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
}
