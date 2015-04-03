var time = 1;
var game = new Game();

function addToGameLog(text) {
	var node = document.createElement("p");
	var textnode = document.createTextNode(text);
	node.appendChild(textnode);
	document.getElementById("gameLogBody").appendChild(node);
}