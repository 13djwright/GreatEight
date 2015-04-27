/*
Card(value) - card object used to describe a card.
value is used to determine which card it is (1-8).
*/

function Card(value) {
	this.value = value;
	this.image = "./images/"+value+".png";
	this.width = 234;
	this.height = 252;
	this.alt = "Playing Card";
	this.visible;
}

/*
Deck() - object that holds all of the Card objects used in the game.
*/

function Deck() {
	this.cards = [];
	this.cardsPlayed = [];
	this.cardsUsed = 0;
	this.makeDeck = makeDeck;
	this.shuffle = shuffleDeck;
	this.deal = dealCard;
	this.cardsLeft = getCardsLeft;
}

/*
Player(isHuman, num) - object that describes a player.
isHuman is a boolean value to determine whether the player is human or a bot
num is an integer value used to set the playerNum value
*/

function Player(isHuman, num) {
	this.playerNum = num;
	this.isHuman = isHuman;
	this.canPlay = true;
	this.playedCards = [];
	this.isTargetable = true;
	this.currentCard;
	this.newCard;
}

/*
Game() - contains the full game and should be set to variable game when intialized (seen in functions.js)
This contains the deck, all players, and all set up needed to play
*/

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

	//Initilize number of cards remaining on screen.
	document.getElementById("cardsInDeck").innerHTML = this.deck.cardsLeft();
	
	var element1 = document.getElementById("playerCard1");
	element1.setAttribute("src", this.players[0].currentCard.image);
	element1 = document.getElementById("playerCard2");
	element1.setAttribute("src", this.players[0].newCard.image);
	//here the game is set up and needs to be updated a player selects a card
}

/*
showCard(card) - card is a Card object
Function for displaying a card to the DOM
*/

function showCard( card ) {
	var img = document.createElement("img");
	img.src = card.image;
	img.width = card.width;
	img.height = card.height;
	img.alt = card.alt;
	document.body.appendChild(img);
}

/*
displayCards(player, playerNum) -  Function for displaying the player's played cards

If calling this from Game, pass the actual player with playerNum=null
If calling this from OUTSIDE of Game, pass the playerNum with player=null

This function deals with the DOM and does not need a unit test
*/

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
		var elem = document.createElement("img");
		elem.setAttribute("src", this.player.playedCards[i].image);
		elem.setAttribute("height", this.player.playedCards[i].height/2.05);
		elem.setAttribute("width", this.player.playedCards[i].width/2.05);
		elem.setAttribute("alt", this.player.playedCards[i].alt);
		dv.appendChild(elem);
	}
}

/*
botTurn(bot) - bot is the bot Player.
bot gets a card, is set to be targetable, and then decides what card to play.
It then selects an appropriate target Player and plays the card.
The card effect happens and the game shows the card the bot played
*/

function botTurn( bot ) {
	if(game.deck.cardsLeft() <= 0) {
		//There are no cards left to draw, determine winner
		var winnerPlayerNum = -1;
		var winnerCardValue = 0;
		var message = "";
		for(var i = 0; i < 4; i ++) {
			if(game.players[i].canPlay) {
				if(game.players[i].currentCard.value > winnerCardValue) {
					winnerCardValue = game.players[i].currentCard.value;
					winnerPlayerNum = i;
				}
			}
		}
		
		if(winnerPlayerNum != 0) {
			message += "Game over. You lost. ";
		}
		message += "Player " + (winnerPlayerNum+1) + " wins with an " + winnerCardValue;
		$('#endModalMessage').html(message);
		$('#endModal').modal().draggable({handle: ".modal-header"});
		$('#playerCard1').removeAttr("onclick");
		$('#playerCard2').removeAttr("onclick");
		return;
	}
	//
	bot.newCard = game.deck.deal();
	bot.isTargetable = true;
	
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
	//FIXME: What if there are no targetable players (someone played a 4) but still more than one person in the game. 
	var targetPlayer = chooseTarget(selectedCard.value, bot.playerNum);
	if(targetPlayer == -1) {
		addToGameLog("Player " + (bot.playerNum+1) + " has no oppenents to choose from. The card " + selectedCard.value + " is thrown away.");
		bot.playedCards.push(selectedCard);
		bot.currentCard = otherCard;
		displayPlayedCards(bot, null);
		return;		
	}
	//this should not run, however, just in case it is left here.
	while(targetPlayer == bot.playerNum ||	!game.players[targetPlayer].isTargetable || !game.players[targetPlayer].canPlay) {
		targetPlayer = Math.floor(Math.random()*4);
	}
	
	bot.playedCards.push(selectedCard);
	bot.currentCard = otherCard;
	
	switch(selectedCard.value) {
		case 1:
			var targetCard = guessCard(targetPlayer, bot); //Math.floor(Math.random() * (9 - 2)) + 2; //this should be the guess card function, but it needs more testing to function correctly
			var message = "";
			
			//addToGameLog("Player " + (bot.playerNum+1) + " played a " + selectedCard.value + " against Player " + (targetPlayer+1));
			//addToGameLog("Player " + (bot.playerNum+1) + " guessed Player " + (targetPlayer+1) + " had a " + targetCard);
			message += "Player " + (bot.playerNum+1) + " guessed Player " + (targetPlayer+1) + " had a " + targetCard + " and was ";
			if(game.players[targetPlayer].currentCard.value == targetCard) {
				//addToGameLog("Player " + (bot.playerNum+1) + "\'s guess was right!");
				message += "right!";
				game.players[targetPlayer].canPlay = false;
				game.players[targetPlayer].isTargetable = false;
				//this should be more obvious that the player didn't play the card but was rather knocked out with it.
				game.players[targetPlayer].playedCards.push(game.players[targetPlayer].currentCard);
				if(targetPlayer == 0) {
					$('#playerCard1').attr("src", "");
					$('#playerCard1').hide();
				}
				displayPlayedCards(null, targetPlayer+1);
			}
			else {
				message += "wrong.";
				//addToGameLog("Player " + (bot.playerNum+1) + "\'s guess was wrong");
			}
			addToGameLog(message);
			break;
		case 2:
			//addToGameLog("Player " + (bot.playerNum+1) + " played a " + selectedCard.value + " against Player " + (targetPlayer+1));
			addToGameLog("Player " + (bot.playerNum+1) + " looked at Player " + (targetPlayer+1) + "\'s card");
			break;
		case 3:
			//addToGameLog("Player " + (bot.playerNum+1) + " played a " + selectedCard.value + " against Player " + (targetPlayer+1));
			//win
			if(bot.currentCard.value > game.players[targetPlayer].currentCard.value) {
				if(targetPlayer == 0) {
					addToGameLog("Player " + (bot.playerNum+1) + " beat your " + game.players[targetPlayer].currentCard.value + " with a " + bot.currentCard.value);
				}
				else {
				    addToGameLog("Player " + (bot.playerNum+1) + " beat Player " + (targetPlayer+1));
				}
				game.players[targetPlayer].canPlay = false;
				game.players[targetPlayer].isTargetable = false;
			}
			//tie
			else if(bot.currentCard.value == game.players[targetPlayer].currentCard.value) {
				addToGameLog("Player " + (bot.playerNum+1) + " tied with Player " + (targetPlayer+1));
			}
			//lose
			else if(bot.currentCard.value < game.players[targetPlayer].currentCard.value) {
				addToGameLog("Player " + (bot.playerNum+1) + " lost against Player " + (targetPlayer+1));
				bot.canPlay = false;
				bot.isTargetable = false;
			}
			else {
				console.log("something is broken in bot's case 3 of playing a card");
			}
			break;
		case 4:
			addToGameLog("Player " + (bot.playerNum+1) + " is not targetable for 1 turn");
			bot.isTargetable = false;
			break;
		case 5:
			addToGameLog("Player " + (bot.playerNum+1) + " played a 5 against Player " + (targetPlayer+1));
			if(game.players[targetPlayer].currentCard.value == 8) {
				addToGameLog("Player " + (targetPlayer+1) + " discarded the 8! They are out of the game.");
				game.players[targetPlayer].canPlay = false;
				game.players[targetPlayer].isTargetable = false;
				game.players[targetPlayer].playedCards.push(game.players[targetPlayer].currentCard);
				displayPlayedCards(null, (targetPlayer+1));
				if(targetPlayer == 0) {
					$("playerCard1").hide();
				}
			}
			else if(game.deck.cardsLeft() > 0){
				var discardedCardValue = game.players[targetPlayer].currentCard.value;
				game.players[targetPlayer].currentCard = game.deck.deal();
				if(targetPlayer == 0) {
					addToGameLog("You had you discard your " + discardedCardValue + " and drew a " + game.players[targetPlayer].currentCard.value);
				}
				else {
					addToGameLog("Player " + (targetPlayer+1) + " discarded and redrew");
				}
			}
			else {
				addToGameLog("Out of cards, Player " + (targetPlayer+1) + " draws discarded card from beginning of game.");
				game.players[targetPlayer].current = game.deck.cards[0];
			}
			
			if(targetPlayer == 0 && game.players[0].canPlay) {
				$('#playerCard1').attr("src", game.players[0].currentCard.image);
			}
			break;
		case 6:
			addToGameLog("Player " + (bot.playerNum+1) + " traded cards with Player " + (targetPlayer+1));
			var temp = bot.currentCard;
			bot.currentCard = game.players[targetPlayer].currentCard;
			game.players[targetPlayer].currentCard = temp;
			//if target player was human player, update their current card image
			if(targetPlayer == 0) {
				addToGameLog("Your " + bot.currentCard.value + " was traded with Player " + (bot.playerNum+1) + "'s " + game.players[0].currentCard.value);
				$('#playerCard1').attr("src", game.players[0].currentCard.image);
			}
			break;
		case 7:
		    addToGameLog("Player " + (bot.playerNum+1) + " played a 7.");
			break;
		case 8:
			addToGameLog("Player " + (bot.playerNum+1) + " is out of the game from playing an 8.");
			bot.canPlay = false;
			bot.isTargetable = false;
			break;
	}
	
	displayPlayedCards(bot, null);
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
		    //FIXME: what if there are no targets left?
			addTargetableButtons();
			document.getElementById("cardGuess").style.display = "block";
			$('#userInput').modal().draggable({handle: ".modal-header"});
			document.getElementById("playCardButton").onclick = function() {
				var selectedPerson = $('input[name=user]:radio:checked').val();
				var guess = $('input[name=guess]:radio:checked').val();
				if(selectedPerson && guess) {
					console.log("check user and guess");
					addToGameLog("You played a 1 and guessed that Player " + selectedPerson + " held a " + guess);
					//addToGameLog("Player " + selectedPerson + " is holding a " + game.players[selectedPerson-1].currentCard.value);
					if(game.players[selectedPerson-1].currentCard.value == guess) {
						//player was right
						addToGameLog("You were right! Good guess.");
						game.players[selectedPerson-1].isTargetable = false;
						game.players[selectedPerson-1].canPlay = false;
						game.players[selectedPerson-1].playedCards.push(game.players[selectedPerson-1].currentCard);
						displayPlayedCards(null, selectedPerson);
					}
					else {
						//player was wrong
						addToGameLog("You were wrong :(");
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
					botLoop();
				}
				//error something was not checked
				else{
					alert.innerHTML = "Select a user and a card guess.";
					alert.style.display = "block";
				}
			};
			break;
		case 2:
			addTargetableButtons();
			document.getElementById('cardGuess').style.display = "none";
			$('#userInput').modal().draggable({handle: ".modal-header"});
			button.onclick = function() {
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
					//window.alert("Player " + selectedPerson + " is holding a " + selectedPersonCard.value);
					addToGameLog("You played a 2. Player " + selectedPerson + " is holding a " + selectedPersonCard.value);
					botLoop();
				}
				else {
					alert.style.display = "block";
					alert.innerHTML = "Select a user";
				}
			};
			
			break;
		case 3:
			addTargetableButtons();
			document.getElementById('cardGuess').style.display = "none";
			$('#userInput').modal().draggable({handle: ".modal-header"});
			button.onclick = function() {
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
						game.players[0].canPlay = false;
					}
					else {
						console.log("something is broken in case 3");
					}
					botLoop();
				}
				else {
					alert.style.display = "block";
					alert.innerHTML = "Select a user";
				}
			};
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
			botLoop();
			break;
		case 6:
			addTargetableButtons();
			document.getElementById('cardGuess').style.display = "none";
			if(otherCard.value === 7) {
					alert.style.display = "block";
					alert.innerHTML = "Cannot play a 6 when holding a 7. Must play 7.";
					document.getElementById("playCardButton").disabled = true;
			}
			$('#userInput').modal().draggable({handle: ".modal-header"});
			button.onclick =  function() {
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
					game.players[selectedPerson-1].currentCard = tempCard;
					document.getElementById("playerCard1").src = game.players[0].currentCard.image;
					addToGameLog("You played a 6 and switched your " + tempCard.value + " with Player " + selectedPerson + "\'s " + game.players[0].currentCard.value);
					botLoop();
				}
				else {
					alert.style.display = "block";
					alert.innerHTML = "Select a user";
				}
				};
			break;
		case 5:
			addTargetableButtons();
			document.getElementById('cardGuess').style.display = "none";
			if(otherCard.value === 7) {
					alert.style.display = "block";
					alert.innerHTML = "Cannot play a 5 when holding a 7. Must play 7.";
					document.getElementById("playCardButton").disabled = true;
			}
			$('#userInput').modal().draggable({handle: ".modal-header"});
			button.onclick = function() {
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
					botLoop();
				}
				else {
					alert.style.display = "block";
					alert.innerHTML = "Select a user";
				}
				};
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
			botLoop();
			break;
		case 8:
			addToGameLog("You played the 8. You lost :(");
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
			botLoop();
			break;
	}	
}

/*
doBotTurn - used to slow down the bots play
i is the bot playerNum
*/

function doBotTurn(i) {
	setTimeout(function() {
			//console.log(i);
			if(game.players[i].canPlay) {
				botTurn(game.players[i]);
				updateBackgrounds();
			}
		}, i*3000);
}

/*
botLoop() - loop for bots to play
*/

function botLoop() {
	updateBackgrounds();
	for(var i = 1; i < 4; i++) {
		doBotTurn(i);
	}
	
	setTimeout(function() {
		//check to see if any of the bots are in play
		var botsInPlay = 0;
		for(var i = 1; i < 4; i++) {
			if(game.players[i].canPlay) {
				botsInPlay++;
			}
		}
		
		//if player is out, game over
		if(!game.players[0].canPlay) {
			$('#endModalMessage').html("Game over. You lost.");
			$('#endModal').modal().draggable({handle: '.modal-header'});
			$('#playerCard1').removeAttr("onclick");
			$('#playerCard2').removeAttr("onclick");
		}
		//otherwise see if the player wins by being the only person left, player wins
		else if(botsInPlay === 0) {
			$('#endModalMessage').html("Congratulations! You WIN!.");
			$('#endModal').modal().draggable({handle: '.modal-header'});
			$('#playerCard1').removeAttr("onclick");
			$('#playerCard2').removeAttr("onclick");
		}
		//if there are no cards left to draw, compare all cards
		else if(game.deck.cardsLeft() <= 0) {
			//There are no cards left to draw, determine winner
			var winnerPlayerNum = -1;
			var winnerCardValue = 0;
			var message = "";
			for(var i = 0; i < 4; i ++) {
				if(game.players[i].canPlay) {
					if(game.players[i].currentCard.value > winnerCardValue) {
						winnerCardValue = game.players[i].currentCard.value;
						winnerPlayerNum = i;
					}
				}
			}
			
			if(winnerPlayerNum != 0) {
				message += "Game over. You lost. ";
				message += "Player " + (winnerPlayerNum+1) + " wins with an " + winnerCardValue;
			}
			else {
				message += "Congratulations!! You win!";
			}
			$('#endModalMessage').html(message);
			$('#endModal').modal().draggable({handle: ".modal-header"});
			$('#playerCard1').removeAttr("onclick");
			$('#playerCard2').removeAttr("onclick");
			return;
		}
		//the game is still going
		else {
			//deal card to player.
			game.players[0].newCard = game.deck.deal();
			game.players[0].isTargetable = true;
			document.getElementById("playerCard2").src = game.players[0].newCard.image;
			document.getElementById("playerCard2").style.visibility = "visible";
		}		
	}, 10000);
}

/*
addTargetableButtons() - Adds radio buttons for current players that are target-able
						 This is a DOM related function and does not need a unit test
*/

function addTargetableButtons() {
//clear out the modal to be remade. each switch case makes the modal custom
	var selectedUserForm = document.getElementById("selectedPlayer");
	while(selectedUserForm.firstChild) {
		selectedUserForm.removeChild(selectedUserForm.firstChild);
	}
	var count = 0;
	var breakNode = document.createElement("br");
	if(game.players[1].isTargetable && game.players[1].canPlay) {
		var player2 = document.createElement("input");
		player2.setAttribute("type", "radio");
		player2.value = 2;
		player2.name = "user";
		selectedUserForm.appendChild(player2);
		var word = document.createElement("p");
		word.innerHTML = "2";
		selectedUserForm.appendChild(word);
		selectedUserForm.appendChild(breakNode);
		count++;
	}
	if(game.players[2].isTargetable && game.players[2].canPlay) {
		var player3 = document.createElement("input");
		player3.setAttribute("type", "radio");
		player3.value = 3;
		player3.name = "user";
		selectedUserForm.appendChild(player3);
		var word = document.createElement("p");
		word.innerHTML = "3";
		selectedUserForm.appendChild(word);
		selectedUserForm.appendChild(breakNode);
		count ++;
	}
	if(game.players[3].isTargetable && game.players[3].canPlay) {
		var player4 = document.createElement("input");
		player4.setAttribute("type", "radio");
		player4.value = 4;
		player4.name = "user";
		selectedUserForm.appendChild(player4);
		var word = document.createElement("p");
		word.innerHTML = "4";
		selectedUserForm.appendChild(word);
		selectedUserForm.appendChild(breakNode);
		count++;
	}
	//FIXME: No players targetable, somehow set up throw away card.
	if(count == 0) {	
		var player0 = document.createElement("input");
		player0.setAttribute("type", "radio");
		player0.value = 0;
		player0.name = "user"
		selectedUserForm.appendChild(player0);
		var word = document.createElement("p");
		word.innerHTML = "No other players targetable, throw this card away";
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
	playerNum is the player playing the card
	
	returns -1 if no legal targets
*/

function chooseTarget(c, playerNum) {
	validTargets = [];
	for(i=0; i<game.players.length; i++) {
		if(game.players[i].isTargetable && i!=playerNum)
			validTargets.push(i);
	}
	
	if(validTargets.length===0)
		return -1;
	
	// default to random target
	var target = validTargets[Math.floor(Math.random()*validTargets.length)];
	switch(c) {
	case 1:
		// a player that's played the countess only has a few likely cards in hand
		for(i=0; i<validTargets.length; i++) {
			if(game.players[validTargets[i]].playedCards.length) {
				if(game.players[validTargets[i]].playedCards[game.players[validTargets[i]].playedCards.length-1].value===7) {
					target = i;
				}
			}
		}
		//if no one has played a 7, use the random target
		break;
	
	case 2:
	// no real targeting priority with 2.
		break;
	
	case 3:
		if(validTargets.length>1) {
			target = validTargets[0];
			for(i=1; i<validTargets.length; i++) {
				//first check if there are any played cards at all, if not, stick with current target.
				if(game.players[validTargets[i]].playedCards.length && game.players[validTargets[target]].playedCards.length) {
					if(game.players[validTargets[i]].playedCards[game.players[validTargets[i]].playedCards.length-1].value<
					  game.players[validTargets[target]].playedCards[game.players[validTargets[target]].playedCards.length-1].value) {
						target = i;
					}
				}
			}
		}
		break;
	
	case 5:
	// cases 5 and 6 have the same targeting algorithm
	case 6:
		if(validTargets.length>1) {
			target = validTargets[0];
			for(i=1; i<validTargets.length; i++)
				if(game.players[validTargets[i]].playedCards[game.players[validTargets[i]].playedCards.length-1]>
				  game.players[validTargets[target]].playedCards[game.players[validTargets[target]].playedCards.length-1])
					target = i;
		}
		break;
	
		
	}	
	
	return target;
}

/*
guessCard(target): Called when a 1 is played by the AI to decide what card it will guess
	target is the player number chosen as the target
	self is the player number making the guess
*/

function guessCard(target, self) {
	var played = [self.currentCard.value];
	for(i=0; i<4; i++) {
		for(j=0; j<game.players[i].playedCards.length; j++) {
			played.push(game.players[i].playedCards[j].value);
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
	
	//we assume the target played their lower card
	var stop;
	if(game.players[target].playedCards.length) {
		stop = game.players[target].playedCards[game.players[target].playedCards.length-1];
	}
	else {
		stop = 2;
	}
	//unless it was the countess
	//check if the target player has played any cards first.
	if(game.players[target].playedCards.length) {
		if(game.players[target].playedCards[game.players[target].playedCards.length-1].value===7)
			stop = 5;
	}
	i=0;
	while(remGuesses[i]<stop)
		i++
	remGuesses.slice(i, remGuesses.length);	
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
		//This displays the updated number of cards in the deck
		document.getElementById("cardsInDeck").innerHTML = this.cardsLeft();
		return this.cards[this.cardsUsed-1];
	}
	else {
		return null;
	}
}

function getCardsLeft() {
	var left = this.cards.length - this.cardsUsed;
	if( left < 0) {
		return 0;
	}
	else {
		return left;
	}
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

/*
updateBackgrounds: Goes through a small loop in the game, and changes the background of a player Area if that player is not in the game anymore
*/

function updateBackgrounds() {
	for(var i = 0; i < 4; i++) {
		if(!game.players[i].canPlay) {
			switch(i) {
				case 0:	$('#playerBottom').css("background","#ccc");
						break;
				case 1: $('#playerLeft').css("background","#ccc");
						break;
				case 2: $('#playerTop').css("background","#ccc");
						break;
				case 3: $('#playerRight').css("background","#ccc");
						break;
			}
		}
	}
}





