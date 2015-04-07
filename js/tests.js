QUnit.test( "8 and 1", function( assert ) {
	assert.expect(2);
	assert.equal( decideCard(8,1), 1, "Eight being first card was chosen." );
	assert.equal( decideCard(1,8), 0, "Eight being second card was chosen." );
});

QUnit.test( "5, 6, and 7", function( assert ) {
	assert.expect(4);
	assert.equal( decideCard(5,7), 1, "5 first 7 second, 7(0) was chosen." );
	assert.equal( decideCard(6,7), 1, "6 first 7 second, 7(0) was chosen." );
	assert.equal( decideCard(7,5), 0, "7 first 5 second, 7(1) was chosen." );
	assert.equal( decideCard(7,6), 0, "7 first 6 second, 7(1) was chosen." );
});
