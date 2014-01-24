var BoardObject = (function () {
	'use strict';

	function BoardObject(oConf) {
		// initialize local shorthand
		var oCfg = oConf || {};

		// allow applications to overwrite the default class
		this.sBoardObjectCssClass =
				oCfg.boardObjectCssClass || BoardObject.DefaultClass;

		this.aPosition = oCfg.aPosition || BoardObject.DefaultStartPos;
	}

	$.extend(BoardObject, {
		DefaultStartPos: [0, 0],
		DefaultClass: 'ge-board-obj'
	});

	BoardObject.prototype = {

		/**
		 * The CSS class to apply to a cell for this board object. Child classes
		 * should be additive when overwriting this.
		 * @return {String|BoardObject.DefaultClass}
		 */
		getCellClass: function() {
			return this.sBoardObjectCssClass;
		},

		/**
		 * Get or set the position(s) of the object on the board.
		 * @param iX {int} Required. The first x position.
		 * @param iY {int} Required. The first y position.
		 * @param iXn {int} Required. Any number of additional x position.
		 * @param iYn {int} Required. Any number of additional y position.
		 * @return {Array} A position array where [x, y] coordinates.
		 */
		position: function(iX, iY, iXn, iYn) {
			if (iX && iY) {
				this.aPosition = arguments.length === 2 ? [iX, iY] :
						$.makeArray(arguments);
			}

			return this.aPosition;
		}
	};

	return BoardObject;
}());