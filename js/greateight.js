function Card(value) {
	this.value = value;
	this.image = "./images/"+value+".png";
	this.width = 234;
	this.height = 252;
	this.alt = "Playing Card";
	this.visible;
}

function Deck() {
	this.cards = [];
	this.cardsPlayed = [];
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
	this.playedCards = [];
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
// Card represents either the current card or new card
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

// Function for displaying the player's played cards
// If calling this from Game, pass the actual player with playerNum=null
// If calling this from OUTSIDE of Game, pass the playerNum with player=null
function displayPlayedCards( player, playerNum ) {
	if( playerNum === null )
		this.player = player;
	else if( player === null )
		this.player = game.players[playerNum-1];
	var playerNum = this.player.playerNum+1;
	var playerName;
	var displayName;
	if( playerNum === 1 ) {
		playerName = "playerBottom";
		displayName = "Player One";
	}
	else if( playerNum === 2 ) {
		playerName = "playerLeft";
		displayName = "Player Two";
	}
	else if( playerNum === 3 ) {
		playerName = "playerTop";
		displayName = "Player Three";
	}
	else if( playerNum === 4 ) {
		playerName = "playerRight";
		displayName = "Player Four";
	}
		
	var elem = document.createElement("img");
	var dv = document.getElementById(playerName);
	// Remove any nodes in our div so we don't just keep adding images
	while( dv.hasChildNodes() ) {
		dv.removeChild(dv.lastChild);
	}
		
	// Re-add the player name text
	var text = document.createTextNode(displayName);
	dv.appendChild(text);
	// Draw all of our images
	for( var i = 0; i < this.player.playedCards.length; i++ ) {
		elem.setAttribute("src", this.player.playedCards[i].image);
		elem.setAttribute("height", this.player.playedCards[i].height/2.05);
		elem.setAttribute("width", this.player.playedCards[i].width/2.05);
		elem.setAttribute("alt", this.player.playedCards[i].alt);
		dv.appendChild(elem);
	}
}

// Function that plays the bot's turn.
// Needs expansion to actually do the card effects
function botTurn( bot ) {
	// Bot draws a card
	bot.newCard = this.deck.deal();
	
	// Select which card to play
	var cardSelected = decideCard( bot.currentCard.value, bot.newCard.value );
	
	var selectedCard;
	var otherCard;
	
	if( !cardSelected ) {
		// Play currentCard
		selectedCard = bot.currentCard;
		otherCard = bot.newCard;
	}
	else if( cardSelected ) {
		// Play newCard
		selectedCard = bot.newCard;
		otherCard = bot.currentCard;
	}
	
	bot.playedCards.push(selectedCard);
	bot.currentCard = otherCard;
}

function targetablePlayers(params) {
	var res = "";
	for(var i = 0; i < params.length; i++) {
		if(params[i].isTargetable) {
			res += " " + (i+1);
		}
	}
	return res;
}
/*
playCard(cardNum): cardNum - used to tell what card was clicked.
initial advance of the game "loop" where the player selects the card to play
along with any additional information needed, and then gets handed off to the bots
to play.
*/
function playCard(cardNum) {
	var cardSelected;
	var otherCard;
	//$('#userInput').modal();
	if(cardNum === 0) {
		cardSelected = game.players[0].currentCard;
		otherCard = game.players[0].newCard;
	}
	else if(cardNum === 1) {
		cardSelected = game.players[0].newCard;
		otherCard = game.players[0].currentCard;
	}
	else {
		console.log("something broken in playCard()");
	}

	var val = cardSelected.value;
	var button = document.getElementById("playCardButton");
	var alert = document.getElementById("alert");
	alert.style.display = "none";
	document.getElementById("playCardButton").disabled = false;
	switch(val) {
		case 1:
			//FIXME: only have the options of players available to select from.
			addTargetableButtons();
			document.getElementById("cardGuess").style.display = "block";
			$('#userInput').modal();
			button.addEventListener("click", function() {
				var selectedPerson = $('input[name=user]:radio:checked').val();
				var guess = $('input[name=guess]:radio:checked').val();
				if(selectedPerson && guess) {
					console.log("check user and guess");
					if(game.players[selectedPerson-1].currentCard.value === guess) {
						//player was right
					}
					else {
						//player was wrong
					}
					game.players[0].playedCards.push(cardSelected);
					game.players[0].currentCard = otherCard;
					//set the newCard element to nothing
					game.players[0].newCard = null;
					//update the display here (card played goes in box, move other card over, and hide card.
					document.getElementById("playerCard2").style.visibility = "hidden"; //hide the new card
					document.getElementById("playerCard1").src = otherCard.image;
					//FIXME: make the played card show up in the box
					$('#userInput').modal('hide');
					displayPlayedCards(null, 1);

				}
				//error something was not checked
				else{
					alert.innerHTML = "Select a user and a card guess.";
					alert.style.display = "block";
				}
			}, false);
			break;
		case 2:
			addTargetableButtons();
			document.getElementById('cardGuess').style.display = "none";
			$('#userInput').modal();
			button.addEventListener("click", function() {
				var selectedPerson = $('input[name=user]:radio:checked').val();
				if(selectedPerson) {
					var selectedPersonCard = game.players[selectedPerson-1].currentCard;
					game.players[0].playedCards.push(cardSelected);
					game.players[0].currentCard = otherCard;
					//set the newCard element to nothing
					game.players[0].newCard = null;
					//update the display here (card played goes in box, move other card over, and hide card.
					document.getElementById("playerCard2").style.visibility = "hidden"; //hide the new card
					document.getElementById("playerCard1").src = otherCard.image;
					$('#userInput').modal('hide');
					displayPlayedCards(null, 1);
					window.alert("Player " + selectedPerson + " is holding a " + selectedPersonCard.value);
					addToGameLog("You played a 2. Player" + selectedPerson + " is holding a " + selectedPersonCard.value);
				}
				else {
					alert.style.display = "block";
					alert.innerHTML = "Select a user";
				}
			}, false);
			
			break;
		case 3:
			addTargetableButtons();
			document.getElementById('cardGuess').style.display = "none";
			$('#userInput').modal();
			button.addEventListener("click", function() {
				var selectedPerson = $('input[name=user]:radio:checked').val();
				if(selectedPerson) {
					var selectedPersonCard = game.players[selectedPerson-1].currentCard;
					game.players[0].playedCards.push(cardSelected);
					game.players[0].currentCard = otherCard;
					//set the newCard element to nothing
					game.players[0].newCard = null;
					//update the display here (card played goes in box, move other card over, and hide card.
					document.getElementById("playerCard2").style.visibility = "hidden"; //hide the new card
					document.getElementById("playerCard1").src = otherCard.image;
					$('#userInput').modal('hide');
					displayPlayedCards(null, 1);
					if(game.players[0].currentCard.value > game.players[selectedPerson-1].currentCard.value) {
						addToGameLog("You beat Player " + selectedPerson + "\'s " + game.players[selectedPerson-1].currentCard.value + " with your " + game.players[0].currentCard.value);
						game.players[selectedPerson-1].isTargetable = false;
						game.players[selectedPerson-1].canPlay = false;
					}
					else if(game.players[0].currentCard.value === game.players[selectedPerson-1].currentCard.value) {
						addToGameLog("You tied Player " + selectedPerson + "\'s " + game.players[selectedPerson-1].currentCard.value + " with your " + game.players[0].currentCard.value);
					}
					else if(game.players[0].currentCard.value < game.players[selectedPerson-1].currentCard.value){
						addToGameLog("You lost against Player " + selectedPerson + "\'s " + game.players[selectedPerson-1].currentCard.value + " with your " + game.players[0].currentCard.value);
						game.players[0].isTargetable = false;
						game.players[1].canPlay = false;
					}
					else {
						console.log("something is broken in case 3");
					}
				}
				else {
					alert.style.display = "block";
					alert.innerHTML = "Select a user";
				}
			}, false);
			break;
		case 4:
			addToGameLog("You are now protected for 1 turn.");
			game.players[0].playedCards.push(cardSelected);
			game.players[0].currentCard = otherCard;
			//set the newCard element to nothing
			game.players[0].newCard = null;
			//update the display here (card played goes in box, move other card over, and hide card.
			document.getElementById("playerCard2").style.visibility = "hidden"; //hide the new card
			document.getElementById("playerCard1").src = otherCard.image;
			displayPlayedCards(null, 1);
			game.players[0].isTargetable = false; //make sure this gets set back to to true at the beginning of next turn
			break;
		case 6:
			addTargetableButtons();
			document.getElementById('cardGuess').style.display = "none";
			if(otherCard.value === 7) {
					alert.style.display = "block";
					alert.innerHTML = "Cannot play a 6 when holding a 7. Must play 7.";
					document.getElementById("playCardButton").disabled = true;
			}
			$('#userInput').modal();
			button.addEventListener("click", function() {
				var selectedPerson = $('input[name=user]:radio:checked').val();
				if(selectedPerson) {
					var selectedPersonCard = game.players[selectedPerson-1].currentCard;
					game.players[0].playedCards.push(cardSelected);
					game.players[0].currentCard = otherCard;
					//set the newCard element to nothing
					game.players[0].newCard = null;
					//update the display here (card played goes in box, move other card over, and hide card.
					document.getElementById("playerCard2").style.visibility = "hidden"; //hide the new card
					document.getElementById("playerCard1").src = otherCard.image;
					$('#userInput').modal('hide');
					displayPlayedCards(null, 1);
					var tempCard = game.players[0].currentCard;
					game.players[0].currentCard = game.players[selectedPerson-1].currentCard;
					game.players[selectedPerson-1].currentCard = game.players[0].currentCard;
					document.getElementById("playerCard1").src = game.players[0].currentCard.image;
					addToGameLog("You played a 6 and switched your " + tempCard.value + "with Player " + selectedPerson + "\'s " + game.players[0].currentCard.value);
				}
				else {
					alert.style.display = "block";
					alert.innerHTML = "Select a user";
				}
				}, false);
			break;
		case 5:
			addTargetableButtons();
			document.getElementById('cardGuess').style.display = "none";
			if(otherCard.value === 7) {
					alert.style.display = "block";
					alert.innerHTML = "Cannot play a 5 when holding a 7. Must play 7.";
					document.getElementById("playCardButton").disabled = true;
			}
			$('#userInput').modal();
			button.addEventListener("click", function() {
				var selectedPerson = $('input[name=user]:radio:checked').val();
				if(selectedPerson) {
					var selectedPersonCard = game.players[selectedPerson-1].currentCard;
					game.players[0].playedCards.push(cardSelected);
					game.players[0].currentCard = otherCard;
					//set the newCard element to nothing
					game.players[0].newCard = null;
					//update the display here (card played goes in box, move other card over, and hide card.
					document.getElementById("playerCard2").style.visibility = "hidden"; //hide the new card
					document.getElementById("playerCard1").src = otherCard.image;
					$('#userInput').modal('hide');
					displayPlayedCards(null, 1);
					addToGameLog("You played a 5 and made Player " + selectedPerson + " discard and draw a new card. ");
					if(game.players[selectedPerson-1].currentCard.value === 8) {
						addToGameLog("Player " + selectedPerson + " discarded the 8! Nice choice Player 1!");
					}
					else if(game.deck.cardsLeft() > 0){
						game.players[selectedPerson-1].currentCard = game.deck.deal();
					}
					else {
						addToGameLog("No cards left to draw, so Player " + selectedPerson + " drew the left over card");
						game.players[selectedPerson-1].currentCard = game.deck.cards[0];
					}
				}
				else {
					alert.style.display = "block";
					alert.innerHTML = "Select a user";
				}
				}, false);
			break;
		case 7:
			addToGameLog("You played a 7");
			game.players[0].playedCards.push(cardSelected);
			game.players[0].currentCard = otherCard;
			//set the newCard element to nothing
			game.players[0].newCard = null;
			//update the display here (card played goes in box, move other card over, and hide card.
			document.getElementById("playerCard2").style.visibility = "hidden"; //hide the new card
			document.getElementById("playerCard1").src = otherCard.image;
			displayPlayedCards(null, 1);
			break;
		case 8:
			addToGameLog("You lost :(");
			game.players[0].playedCards.push(cardSelected);
			game.players[0].currentCard = otherCard;
			//set the newCard element to nothing
			game.players[0].newCard = null;
			//update the display here (card played goes in box, move other card over, and hide card.
			document.getElementById("playerCard2").style.visibility = "hidden"; //hide the new card
			document.getElementById("playerCard1").src = otherCard.image;
			displayPlayedCards(null, 1);
			game.players[0].isTargetable = false;
			game.players[0].canPlay = false;
			//game.gameOver = true; //This might not be needed if we want to keep the game going between the bots
			break;
	}	
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
function addTargetableButtons() {
//clear out the modal to be remade. each switch case makes the modal custom
	var selectedUserForm = document.getElementById("selectedPlayer");
	while(selectedUserForm.firstChild) {
		selectedUserForm.removeChild(selectedUserForm.firstChild);
	}
	
	var breakNode = document.createElement("br");
	if(game.players[1].isTargetable) {
		var player2 = document.createElement("input");
		player2.setAttribute("type", "radio");
		player2.value = 2;
		player2.name = "user";
		selectedUserForm.appendChild(player2);
		var word = document.createElement("p");
		word.innerHTML = "2";
		selectedUserForm.appendChild(word);
		selectedUserForm.appendChild(breakNode);
	}
	if(game.players[2].isTargetable) {
		var player3 = document.createElement("input");
		player3.setAttribute("type", "radio");
		player3.value = 3;
		player3.name = "user";
		selectedUserForm.appendChild(player3);
		var word = document.createElement("p");
		word.innerHTML = "3";
		selectedUserForm.appendChild(word);
		selectedUserForm.appendChild(breakNode);
	}
	if(game.players[3].isTargetable) {
		var player4 = document.createElement("input");
		player4.setAttribute("type", "radio");
		player4.value = 4;
		player4.name = "user";
		selectedUserForm.appendChild(player4);
		var word = document.createElement("p");
		word.innerHTML = "4";
		selectedUserForm.appendChild(word);
		selectedUserForm.appendChild(breakNode);
	}
}

 /*
decideCard(a, b): Bots' decision-making algorithm
	a and b are card values.
	Returns 0 to choose a, 1 to choose b
*/

function decideCard(a, b) {
	if(a===8)
		return 1;
	if(b===8)
		return 0;
	
	if(a+b>11) {
		if(a===7)
			return 0;
		else
			return 1;
	}
	
	if(a===b)
		return 0;
	
	var high = a;
	var low = b;
	var decision = 1;
	var invert = 0;
	if(b > a) {
		high = b;
		low = a;
		invert = 1;
	}
	
	if(high === 6 && low < 4)
		decision = 0;
		
	if(high === 2)
		decision = 0;
		
	return decision ^ invert;
}

/*
chooseTarget(c): selects an opposing player to target with a card whose effect requires a target
	c is the value of the card
	playerNum is the number of the player playing the card (to avoid self-targeting)
	
	returns -1 if no legal targets
*/
function chooseTarget(c,playerNum) {
	validTargets = [];
	for(i=0; i<game.players.length; i++) {
		if(game.players[i].isTargetable)
			validTargets.push(i)
	}
	
	if(validTargets.length===0)
		return -1
	
	target = Math.floor(Math.random()*validTargets.length);
	return target;
	
/*	switch(c) {
	case 1:
			
	
	case 2:
		
	
	case 3:
		
	
	case 5:
		
	
	case 6:
		
	}
*/
}

/*
guessCard(): Called when a 1 is played by the AI to decide what card it will guess
*/

function guessCard() {
	var played = [];
	for(i=0; i<4; i++) {
		for(j=0; j<game.players[i].playedCards.length; j++) {
			played.push(game.players[i].playedCards[j]);
		}
	}

	playCounts = [0, 0, 0, 0, 0, 0, 0, 0]
	for(i=0; i<played.length; i++) {
		playCounts[played[i]-1]++;
	}

	remGuesses = [];
	for(i=2; i<6; i++)
		if(playCounts[i-1]<2)
			remGuesses.push(i);
	for(i=6; i<9; i++)
		if(playCounts[i-1]==0)
			remGuesses.push(i);
	guess = remGuesses[Math.floor(Math.random()*remGuesses.length)];
	return guess;
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






