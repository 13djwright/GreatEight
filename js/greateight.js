function Card(value, image) {
	this.value = value;
	this.image = image;
	this.visible;
}

function Deck() {
	this.cards = new Array();
	this.cardsPlayer = new Array();
	
	this.makeDeck = makeDeck;
	this.shuffle = shuffleDeck;
	this.deal = dealCard;
	this.cardsLeft = getCardsLeft;
	

}