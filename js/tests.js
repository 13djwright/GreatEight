/*
	Tests for decideCard function
*/
QUnit.test( "8 and 1 - decideCard", function( assert ) {
	assert.expect(2);
	assert.equal( decideCard(8,1), 1, "Eight being first card was chosen." );
	assert.equal( decideCard(1,8), 0, "Eight being second card was chosen." );
});

QUnit.test( "5, 6, and 7 - decideCard", function( assert ) {
	assert.expect(4);
	assert.equal( decideCard(5,7), 1, "5 first 7 second, 7(0) was chosen." );
	assert.equal( decideCard(6,7), 1, "6 first 7 second, 7(0) was chosen." );
	assert.equal( decideCard(7,5), 0, "7 first 5 second, 7(1) was chosen." );
	assert.equal( decideCard(7,6), 0, "7 first 6 second, 7(1) was chosen." );
});

QUnit.test( "Same card - decideCard", function( assert ) {
	assert.expect(1);
	assert.equal( decideCard(1,1), 0, "Same card so first(0) one was chosen." );
});

QUnit.test("6 with value <4 - decideCard", function(assert) {
	assert.expect(6);
	assert.equal(decideCard(6,3), 0, "6 first 3 second, 6 is chosen (1/6)");
	assert.equal(decideCard(6,2), 0, "6 first 2 second, 6 is chosen (2/6)");
	assert.equal(decideCard(6,1), 0, "6 first 1 second, 6 is chosen (3/6)");
	assert.equal(decideCard(3,6), 1, "3 first 6 second, 6 is chosen (4/6)");
	assert.equal(decideCard(2,6), 1, "2 first 6 second, 6 is chosen (5/6)");
	assert.equal(decideCard(1,6), 1, "1 first 6 second, 6 is chosen (6/6)");
});

QUnit.test("Specific case: 1 and 2 - decideCard", function(assert) {
	assert.expect(2);
	assert.equal(decideCard(2,1), 0, "2 first 1 second, 2(0) is chosen");
	assert.equal(decideCard(1,2), 1, "1 first 2 second, 2(1) is chosen");
});

QUnit.test("General case - decideCard", function(assert) {
	assert.expect(2);
	assert.equal(decideCard(1,3), 0, "1 first 3 second, 1(0) is chosen");
	assert.equal(decideCard(4,3), 1, "4 first 3 second, 3(1) is chosen");
});

/*
	Tests for chooseTarget function
 */

QUnit.test("1 played (Most recent plays {3,5,1,7}) - chooseTarget", function(assert) {
/*	var game = new Game();
	game.players[0].playedCards.push(new Card(3));
	game.players[1].playedCards.push(new Card(5));
	game.players[2].playedCards.push(new Card(1));
	game.players[3].playedCards.push(new Card(7));
*/
	assert.expect(0);

//	assert.expect(1);
//	assert.equal(chooseTarget(1,0), 3, "Player 0 plays, chooses player 3");

});

QUnit.test("3 played - chooseTarget", function(assert) {
	assert.expect(0);
	//various combinations of last plays from opponents
});

QUnit.test("5 or 6 played - chooseTarget", function(assert) {
	assert.expect(0);
	// various combinations of last plays from opponents
});

QUnit.test("One valid target - chooseTarget", function(assert) {
	assert.expect(0);
	// all but one other player untargetable or eliminated
});

QUnit.test("No valid targets - chooseTarget", function(assert) {
	assert.expect(0);
	// all other players untargetable or eliminated
});


/*
	Tests for the guessCard function
 */

QUnit.test("All cases - guessCard", function(assert) {
	// target just played 7
	// target just played 2
	// general case (all others)
	assert.expect(0);
});

/*
	Austin, please implement the rest of the cases
	for decideCard. These few examples will get you going.
	
	Go ahead and also make tests for chooseTarget and guessCard functions
	These will require more set up I suspect, but you can just create a small
	"game" to test with creating players and cards and what not
*/


/*
	Other functions that need tests:
	playersLeftInPlay, getCardsLeft, dealCard, 
*/



