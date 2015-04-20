var time = 1;
var game = new Game();

function addToGameLog(text) {
	$.notify({
		message: text
	},{
		type: 'info',
		placement: {
			from: 'top',
			align: 'center'
		},
		delay: 5000,
		allow_dismiss: true
	}
	);
	var node = document.createElement("p");
	var textnode = document.createTextNode(text);
	node.appendChild(textnode);
	document.getElementById("gameLogBody").appendChild(node);
}