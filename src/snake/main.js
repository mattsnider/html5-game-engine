(function() {
	'use strict';

	var game = new GameSnake();
	game.start();

	// todo: move this into a game controller system
	$(document).keydown(function(e) {
		game.setKey(e.keyCode);
	});

	$(document).keyup(function(e) {
		game.setKey(0);
	});
}());