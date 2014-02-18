var GameSnakeStaged = (function () {
  'use strict';
  function GameSnakeStaged(el, oConf) {
    this.super(GameSnake, arguments);
  }

  $.extend(GameSnakeStaged, {
    DefaultStagePoints: 10
  });

  $.MS.extend(GameSnakeStaged, GameSnake, {

    // @Override
    _handlePowerUp: function() {
      this.super(GameSnake, arguments, '_handlePowerUp');
      this.iPowerUpCounter++;

      if (this.iPowerUpCounter % this.iPowerUpCounterMod === 0) {
        this.fire(Game.sStageWinEvent);
        this.fire(Game.sStageEndEvent);
        this.fire(Game.sStageStartEvent);
      }
    },

    /**
     * Fired when the stage ends.
     * @private
     */
    _handleStageEnd: function() {
      this.iStageCounter += 1;
    },

    /**
     * Fired when the stage is failed.
     * @private
     */
    _handleStageFail: function() {

    },

    /**
     * Fired when the stage starts.
     * @private
     */
    _handleStageStart: function() {
      this.renderPowerUp();
    },

    /**
     * Fired when the stage is won.
     * @private
     */
    _handleStageWin: function() {
      // stage is changed here, so the alert can allow players to prepare
      // for the next stage
      var oBoard = this.getBoard();
      oBoard.loadMap(oBoard.generateMap({
        aExcludedPositions: [this.getCharacter().position()],
        iNumInternalWall: oBoard.oCfg.map.iNumInternalWall +
                          (this.iStageCounter * 2)
      }), true);
      alert('You beat Stage ' + this.iStageCounter);
      this.fire(Game.sPointEvent,
                GameSnakeStaged.DefaultStagePoints * this.iStageCounter);
    },

    // @Override
    reset: function() {
      // prevent duplicate listeners
      this.off(Game.sStageEndEvent, this._handleStageEnd);
      this.off(Game.sStageFailEvent, this._handleStageFail);
      this.off(Game.sStageStartEvent, this._handleStageStart);
      this.off(Game.sStageWinEvent, this._handleStageWin);

      // register events as part of start
      this.on(Game.sStageEndEvent, this._handleStageEnd);
      this.on(Game.sStageFailEvent, this._handleStageFail);
      this.on(Game.sStageStartEvent, this._handleStageStart);
      this.on(Game.sStageWinEvent, this._handleStageWin);

      // local listeners need to be handled before calling super
      this.super(GameSnake, arguments, 'reset');

      // local variables
      this.iPowerUpCounter = 0;
      this.iPowerUpCounterMod = 5;
      this.iStageCounter = 1;
    }
  });

  return GameSnakeStaged;
}());