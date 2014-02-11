var GameSnake = (function () {
  'use strict';
  var PowerUp = $.MS.extend(function PowerUpSnake(el, oConf) {
    // initialize local shorthand
    var oCfg = oConf || {};
    this.super(BoardObject, arguments);

    // allow applications to overwrite the default class
    this.sPowerUpCssClass =
        oCfg.sPowerUpCssClass || PowerUp.DefaultClass;
  }, BoardObject, {
    // @override
    getCellClass: function() {
      return this.super(BoardObject, arguments, 'getCellClass') + ' ' +
          this.sPowerUpCssClass;
    }
  });

  $.extend(PowerUp, {
    DefaultClass: 'ge-board-snake-pu',
    DefaultPoints: 10,
    sBeforePowerUpEvent: 'beforePowerUpEvent',
    sPowerUpEvent: 'powerUpEvent'
  });

  return $.MS.extend(function GameSnake(el, oConf) {
    this.super(Game, arguments);

    var oBoard = new BoardSnake('#id_game_board');

    var oCharacter = new CharacterSnake(
      {aPosition: CharacterSnake.DefaultStartPosition});
    oBoard.loadMap(oBoard.generateMap({
      aExcludedPositions: [oCharacter.position()]
    }), true);
    oBoard.renderIn(oCharacter);

    this.aAssets.push(oBoard);
    this.aAssets.push(oCharacter);
    this.iDirection = 39;
  }, Game, {

    // left
    '37': function() {
      this.iDirection = 37;
    },

    // up
    '38': function() {
      this.iDirection = 38;
    },

    // right
    '39': function() {
      this.iDirection = 39;
    },

    // down
    '40': function() {
      this.iDirection = 40;
    },

    /**
     * Add a powerup to the board, if not already there.
     */
    addPowerup: function() {
      if (!this.getPowerUp()) {
        var oPowerUp = new PowerUp();
        this.aAssets.push(oPowerUp);
        this.renderPowerUp();
      }
    },

    // @override
    _cycle: function() {
      this.super(Game, arguments, '_cycle');

      if (!this.bPaused) {
        switch (this.iDirection) {
          case 37:
            return this.moveCharacterLeft();
          case 38:
            return this.moveCharacterUp();
          case 39:
            return this.moveCharacterRight();
          case 40:
            return this.moveCharacterDown();
        }
      }
    },

    /**
     * Helper function for fetching the board.
     * @return {SnakeBoard} A SnakeBoard instance.
     */
    getBoard: function() {
      return this.assets(BoardSnake)[0];
    },

    /**
     * Helper function for fetching the character.
     * @return {Character} A Character instance.
     */
    getCharacter: function() {
      return this.assets(CharacterSnake)[0];
    },

    /**
     * Helper function for fetching the power up.
     * @return {PowerUp} A PowerUp instance.
     */
    getPowerUp: function() {
      return this.assets(PowerUp)[0];
    },

    // @Override
    _handleGameStart: function() {
      this.super(Game, arguments, '_handleGameStart');
      this.addPowerup();
    },

    /**
     * Called by the move method to handle when the user interacts with
     * the powerup.
     * @private
     */
    _handlePowerUp: function() {
      this.fire(Game.sPointEvent, PowerUp.DefaultPoints);
      this.getCharacter().increaseSize();
      // get another powerup
      this.getBoard().renderOut(this.getPowerUp());
      this.renderPowerUp();
    },

    /**
     * Move the character to the provided position.
     * @param iX {int} Required. The x position.
     * @param iY {int} Required. The y position.
     */
    moveCharacter: function(iX, iY) {
      var oBoard = this.getBoard();
      var bPowerUp;
      var oCharacter;
      var oPowerUp;

      switch(oBoard.evalMove(iX, iY)) {
        case Board.MOVE_STATUS.OUT_OF_BOUNDS:
          // should not happen, so do nothing
          return;

        // snake is terminal when you die, so all terminal events are game over
        case Board.MOVE_STATUS.OBJECT_COLLISION:
          oPowerUp = this.getPowerUp();
          bPowerUp = -1 !== $.inArray(oPowerUp, oBoard.objectsAt(iX, iY));

          // if the collision was not a powerup, then game over man
          if (!bPowerUp) {
            this.fire(Game.sGameOverEvent);
            return;
          }
      }

      oCharacter = this.getCharacter();
      oBoard.renderOut(oCharacter);

      if (bPowerUp && false !== this.fire(PowerUp.sBeforePowerUpEvent)) {
        this.fire(PowerUp.sPowerUpEvent);
      }

      oCharacter.position(iX, iY);
      oBoard.renderIn(oCharacter);
    },

    /**
     * Helper function to move the character down one.
     */
    moveCharacterDown: function() {
      var aPos = this.getCharacter().position();
      this.moveCharacter(aPos[0], aPos[1] + 1);
    },

    /**
     * Helper function to move the character left one.
     */
    moveCharacterLeft: function() {
      var aPos = this.getCharacter().position();
      this.moveCharacter(aPos[0] - 1, aPos[1]);
    },

    /**
     * Helper function to move the character right one.
     */
    moveCharacterRight: function() {
      var aPos = this.getCharacter().position();
      this.moveCharacter(aPos[0] + 1, aPos[1]);
    },

    /**
     * Helper function to move the character up one.
     */
    moveCharacterUp: function() {
      var aPos = this.getCharacter().position();
      this.moveCharacter(aPos[0], aPos[1] - 1);
    },

    /**
     * Find a position for the powerup and render it onto the board.
     */
    renderPowerUp: function() {
      var oBoard = this.getBoard();
      var oPowerUp = this.getPowerUp();
      var aPos = oBoard.getRandomEmptyPosition.apply(
          oBoard, this.getCharacter().position());
      oPowerUp.position(aPos[0], aPos[1]);
      oBoard.renderIn(oPowerUp);
    },

    // @Override
    reset: function() {
      // prevent duplicate listeners
      this.off(Game.sGameStartEvent, this._handleGameStart);
      this.off(PowerUp.sPowerUpEvent, this._handlePowerUp);

      // register events as part of start
      this.on(Game.sGameStartEvent, this._handleGameStart);
      this.on(PowerUp.sPowerUpEvent, this._handlePowerUp);

      // local listeners need to be handled before calling super
      this.super(Game, arguments, 'reset');
    }
  });
}());