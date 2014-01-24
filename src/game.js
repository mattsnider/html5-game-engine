var Game = (function() {
	'use strict';

	function Game(oConf) {
		// initialize local shorthand
		var oCfg = oConf || {};

		// initialize from configuration
		this.iAnimationId = 0;
		this.iCycleInterval = oCfg.iCycleInterval || Game.iDefaultCycleInterval;
		this.reset();
	}

	$.extend(Game, {
		/* controls the speed of the game */
		iDefaultCycleInterval: 200,
		sGameEndEvent: 'GameEnd',
		sGameOverEvent: 'GameOver',
		sGameStartEvent: 'GameStart',
		sGameWinEvent: 'GameWin'
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
//			console.log('cycle=' + this.iCycle);
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
		 * Game over event callback.
		 * @private
		 */
		_handleGameOver: function() {
			this.stop();
			alert('Game Over');
		},

		/**
		 * Win event callback.
		 * @private
		 */
		_handleWin: function() {
			this.stop();
			alert('Winner');
		},

		/**
		 * Pause the game or set the pause state to the provided boolean.
		 * @param {boolean} bPaused Optional. The new pause state.
		 */
		pause: function(bPaused) {
			console.log('Pause called with - ' + bPaused);
			this.bPaused = bPaused || false;
		},

		reset: function() {
			this.aAssets = [];
			this.bPaused = true;
			this.dCycleTime = null;
			this.iKeyQueue = [0, 0];
			this.iCycle = 0;

			if (this.iAnimationId) {
				this.stop();
				this.start();
			}
		},

		runner: function() {
			// the long interval has passed, go ahead and process next game cycle
			if (this.dCycleTime + this.iCycleInterval <= (new Date()).getTime()) {
				this.iCycle++;
				this.dCycleTime = (new Date()).getTime();
				this._cycle();
			}

			this.iAnimationId = window.requestAnimationFrame(
					$.proxy(this, 'runner'));
		},

		setKey: function(iKeyCode) {
			if (!this.iKeyQueue[0]) {
				this.iKeyQueue[0] = iKeyCode;
			}
			else {
				this.iKeyQueue[1] = iKeyCode;
			}
		},

		start: function() {
			this.runner();
			this.iCycle = 0;
			this.dCycleTime = (new Date()).getTime();
			this.trigger(Game.sGameStartEvent);

			this.on(Game.sGameOverEvent, this._handleGameOver);
			this.on(Game.sGameWinEvent, this._handleWin);
		},

		stop: function() {
			clearInterval(this.iAnimationId);
			this.iAnimationId = 0;
			this.trigger(Game.sGameEndEvent);
			this.off(Game.sGameOverEvent, this._handleGameOver);
			this.off(Game.sGameWinEvent, this._handleWin);
		}
	}, $.MS.CE);

	return Game;
}());