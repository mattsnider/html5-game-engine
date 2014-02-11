var Game = (function() {
  'use strict';

  function Game(oConf) {
    // initialize local shorthand
    var oCfg = oConf || {};

    // scoreboard is shown by default or when option is true
    this.bHasScoreBoard = oCfg.bHasScoreBoard ||
                          oCfg.bHasScoreBoard === undefined;
    this.iAnimationId = 0;
    this.iCycleInterval = oCfg.iCycleInterval || Game.iDefaultCycleInterval;
    this.reset();
  }

  $.extend(Game, {
    /* controls the speed of the game */
    iDefaultCycleInterval: 200,
    sGameEndEvent: 'GameEndEvent',
    sGameOverEvent: 'GameOverEvent',
    sGameStartEvent: 'GameStartEvent',
    sGameWinEvent: 'GameWinEvent',
    sBeforePauseEvent: 'BeforePauseEvent',
    sPauseEvent: 'PauseEvent',
    sPointEvent: 'PointEvent',
    sStageEndEvent: 'StageEndEvent',
    sStageFailEvent: 'StageFailEvent',
    sStageStartEvent: 'StageStartEvent',
    sStageWinEvent: 'StageWinEvent'
  });

  $.extend(Game.prototype, {
    /**
     * The default spacebar handler. Pause/unpause the game.
     */
    '32': function() {
      this.pause(!this.bPaused);
    },

    /**
     * Returns a collection of game assets.
     * @param fnClass {function} Object. Return only assets of this type.
     */
    // todo: think about games with large asset sets... will need some kind of caching logic
    assets: function(fnClass) {
      if (fnClass) {
        return $.grep(this.aAssets, function(o) {
          return o instanceof fnClass;
        });
      }
      else {
        return this.aAssets;
      }
    },

    _cycle: function() {
//      console.log('cycle=' + this.iCycle);
      var iKeyCode = this.iKeyQueue[0];

      if (iKeyCode) {
        if (this[iKeyCode]) {
          this[iKeyCode]();
        }
        this.iKeyQueue[0] = this.iKeyQueue[1];
        this.iKeyQueue[1] = 0;
      }
    },

    /**
     * Game end event callback.
     * @private
     */
    _handleGameEnd: function() {
      // do nothing here
    },

    /**
     * Game over event callback.
     * @private
     */
    _handleGameOver: function() {
      this.stop();
      alert('Game Over');
    },

    /**
     * Game start event callback.
     * @private
     */
    _handleGameStart: function() {
      // do nothing here
    },

    /**
     * Win event callback.
     * @private
     */
    _handleGameWin: function() {
      this.stop();
      alert('Winner');
    },

    /**
     * Point event callback.
     * @private
     */
    _handlePoint: function(e) {
      this.iTotalPoints += e.message;

      if (this.oScoreBoard) {
        this.oScoreBoard.update(this.iTotalPoints);
      }
    },

    /**
     * Pause the game or set the pause state to the provided boolean.
     * @param {boolean} bPaused Optional. The new pause state.
     */
    pause: function(bPaused) {
      if (false !== this.fire(Game.sBeforePauseEvent, bPaused)) {
        console.log('Pause called with - ' + bPaused);
        this.bPaused = bPaused || false;
        this.fire(Game.sPauseEvent, bPaused);
      }
    },

    reset: function() {
      console.log('reset');
      this.aAssets = [];
      this.bPaused = true;
      this.bTerminal = true;
      this.dCycleTime = null;
      this.iCycle = 0;
      this.iKeyQueue = [0, 0];
      this.iTotalPoints = 0;

      // prevent duplicate listeners
      this.off(Game.sGameEndEvent, this._handleGameEnd);
      this.off(Game.sGameOverEvent, this._handleGameOver);
      this.off(Game.sGameStartEvent, this._handleGameStart);
      this.off(Game.sGameWinEvent, this._handleGameWin);
      this.off(Game.sPointEvent, this._handlePoint);

      // register events as part of start
      this.on(Game.sGameEndEvent, this._handleGameEnd);
      this.on(Game.sGameOverEvent, this._handleGameOver);
      this.on(Game.sGameStartEvent, this._handleGameStart);
      this.on(Game.sGameWinEvent, this._handleGameWin);
      this.on(Game.sPointEvent, this._handlePoint);

      if (this.iAnimationId) {
        this.stop();
        this.start();
      }
    },

    runner: function() {
      // special-case logic, to stop thread, because cancelAnimationFrame
      // is not working as expected.
      if (this.bTerminal) {
        return;
      }

      // the long interval has passed, go ahead and process next game cycle
      if (this.dCycleTime + this.iCycleInterval <= (new Date()).getTime()) {
        this.iCycle++;
        this.dCycleTime = (new Date()).getTime();
        this._cycle();
      }

      this.iAnimationId = window.requestAnimationFrame(
          $.proxy(this, 'runner'));
    },

    /**
     * Interface to pass keycodes into the game. If a key handler function
     * is defined, then it will return true, otherwise false.
     * @param iKeyCode {int} Required. The keycode to set.
     * @return {Boolean} Keycode function is defined.
     */
    setKey: function(iKeyCode) {
      if (!this.iKeyQueue[0]) {
        this.iKeyQueue[0] = iKeyCode;
      }
      else {
        this.iKeyQueue[1] = iKeyCode;
      }

      return !!this[iKeyCode];
    },

    start: function() {
      console.log('start');
      this.bTerminal = false;
      this.runner();
      this.iCycle = 0;
      this.dCycleTime = (new Date()).getTime();

      if (this.bHasScoreBoard && !this.oScoreBoard) {
        this.oScoreBoard = new ScoreBoard(this.assets(Board)[0]);
        this.oScoreBoard.render();
      }

      // fire events last
      this.fire(Game.sGameStartEvent);
    },

    stop: function() {
      console.log('stop - ' + this.iAnimationId);
      window.cancelAnimationFrame(this.iAnimationId);
      this.bTerminal = true;
      this.iAnimationId = 0;
      this.fire(Game.sGameEndEvent);
    }
  }, $.MS.CE);

  return Game;
}());