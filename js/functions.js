var time = 1;
var game;
function loadGame() {
	//120 because the loading bar would disappear before done "loading"
	//if (time>=110) {
		clearInterval(interval);
		//remove the bar and display the game
		document.getElementById("progressbar").style.display="none";
		game = new Game();
	//}
	document.getElementById("bar").style.width=time+"%";
	time++;
}
var interval=setInterval(function () {loadGame()}, 100);



