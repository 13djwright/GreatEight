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



