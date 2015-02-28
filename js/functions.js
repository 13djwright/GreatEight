var time = 1;
var deck;

function loadGame() {
	//120 because the loading bar would disappear before done "loading"
	if (time>=110) {
		clearInterval(interval);
		//remove the bar and display the game
		document.getElementById("progressbar").style.display="none";
		deck = new Deck();
		deck.makeDeck();
		deck.shuffle(2);
	}
	document.getElementById("bar").style.width=time+"%";
	time++;
}

var interval=setInterval(function () {loadGame()}, 100);

