(function() {
  'use strict';

  var game = new GameSnake();
  game.start();

  // todo: move this into a game controller system
  $(document).keydown(function(e) {
    game.setKey(e.keyCode);
    e.preventDefault();
  });

  $(document).keyup(function(e) {
    game.setKey(0);
    e.preventDefault();
  });
}());