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
		DefaultClass: 'ge-board-snake-pu'
	});

	return $.MS.extend(function GameSnake(el, oConf) {
		this.super(Game, arguments);

		var oBoard = new BoardSnake('#id_game_board');
		var aMap = [
			['*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
			['*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
			['*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
			['*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
			['*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
			['*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
			['*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
			['*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
			['*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
			['*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
			['*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
			['*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
			['*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
			['*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
			['*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
			['*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*', '*', '*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
			['*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
			['*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
			['*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
			['*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
			['*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
			['*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
			['*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
			['*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
			['*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*']
		];
		oBoard.loadMap(aMap, true);

		var oCharacter = new CharacterSnake({aPosition: [1, 1]});
		oBoard.renderIn(oCharacter);

		this.aAssets.push(oBoard);
		this.aAssets.push(oCharacter);
		this.iDirection = 39;

		this.on(Game.sGameStartEvent, this._handleGameStart);
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

		_handleGameStart: function() {
			this.addPowerup();
		},

		/**
		 * Move the character to the provided position.
		 * @param iX {int} Required. The x position.
		 * @param iY {int} Required. The y position.
		 */
		moveCharacter: function(iX, iY) {
			var oBoard = this.getBoard(),
				iPos = [iX, iY],
				bPowerUp, oCharacter, oPowerUp;

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
						this.trigger(Game.sGameOverEvent);
						break;
					}
			}

			oCharacter = this.getCharacter();
			oBoard.renderOut(oCharacter);

			if (bPowerUp) {
				oCharacter.increaseSize();
			}

			oCharacter.position(iX, iY);
			oBoard.renderIn(oCharacter);

			// get another powerup
			if (bPowerUp) {
				oBoard.renderOut(oPowerUp);
				this.renderPowerUp();
			}
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
			var oBoard = this.getBoard(),
				oPowerUp = this.getPowerUp(),
				aPos = oBoard.getRandomEmptyPosition.apply(
						oBoard, this.getCharacter().position());
			oPowerUp.position(aPos[0], aPos[1]);
			oBoard.renderIn(oPowerUp);
		}
	});
}());