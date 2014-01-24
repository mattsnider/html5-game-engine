var Board = (function () {
	'use strict';

	function fnPosKey(aPos) {
		return aPos[0] + ',' + aPos[1];
	}

	function Board(el, oConf) {
		// initialize local shorthand
		var oCfg = oConf || {};

		// prepare the root node
		this.$node = $(el);

		// initialize from configuration
//		this.iCellHeight = this.$node.width() / this.iHeight;
//		this.iCellWidth = this.$node.width() / this.iWidth;
		this.oMatrix = [];
		this.oBoardObjects = {};
	}

	$.extend(Board, {
		CLASS_BOARD: 'ge-board',
		CLASS_CELL: 'ge-board-cell',

		HTML: {
			cell: '<div></div>'
		},

		MOVE_STATUS : {
			OUT_OF_BOUNDS: -1,
			OBJECT_COLLISION: 0,
			EMPTY: 1
		}
	});

	Board.prototype = {
		iXLen: 100,
		iYLen: 100,

		oMap: undefined,

		/**
		 * An additional class to add to board, 'ge-board' will always be added.
		 */
		sClass: '',

		/**
		 * An additional class to add to board cells,
		 * 'ge-board-cell' will always be added.
		 */
		sClassCell: '',

		/**
		 * Renders a cell, should be overwritten by game specific subclass.
		 * @param $el {jQuery} Required. The cell element.
		 * @param iX {int} Required. The x coordinate.
		 * @param iY {int} Required. The y coordinate.
		 * @private
		 */
		_cellRenderer: function($el, iX, iY) {
			$el.addClass(this._getCellClasses(iX, iY));
		},

		/**
		 * Evaluate the validity of a move.
		 * @param iX {int} Required. The x coordinate.
		 * @param iY {int} Required. The y coordinate.
		 * @return {int} The status of the move.
		 */
		evalMove: function(iX, iY) {
			if (iX < 0 || iX >= this.iXLen || iY < 0 || iY >= this.iYLen) {
				return Board.MOVE_STATUS.OUT_OF_BOUNDS;
			}

			return this.objectsAt(iX, iY).length > 0 ?
					Board.MOVE_STATUS.OBJECT_COLLISION :
					Board.MOVE_STATUS.EMPTY;
		},

		/**
		 * Get the jQuery element specified by the coordinates. Can actually
		 * accept any number of x, y pairs.
		 * @param iX {int} Required. The first x position.
		 * @param iY {int} Required. The first y position.
		 * @param iXn {int} Required. Any number of additional x position.
		 * @param iYn {int} Required. Any number of additional y position.
		 * @return {jQuery} A jQuery element.
		 */
		get: function(iX, iY, iXn, iYn) {
			var $el = $(),
				args = arguments,
				i, j;

			for (i = 0, j = args.length; i < j; i += 2) {
				iX = args[i];
				iY = args[i + 1];
				$el = $el.add(this.oMatrix[iX][iY]);
			}

			return $el;
		},

		_getCellClasses: function() {
			return Board.CLASS_CELL + ' ' + this.sClassCell;
		},

		/**
		 * Fetch a random empty position.
		 * @param aPos {array} Optional. The first extra position to also exclude.
		 * @param aPosN {array} Optional. Any number of extra positions to
		 * also exclude.
		 * @return {array} A position.
		 */
		getRandomEmptyPosition: function(aPos, aPosN) {
			var iX, iY;

			do {
				iX = $.MS.randomInt(this.iXLen - 1);
				iY = $.MS.randomInt(this.iYLen - 1);
			} while (this.objectsAt(iX, iY).length > 0);

			return [iX, iY];
		},

		/**
		 * Return a list of objects at the coordinates.
		 * @param iX {int} Required. The x coordinate.
		 * @param iY {int} Required. The y coordinate.
		 * @return {array} Collection of BoardObjects.
		 */
		objectsAt: function(iX, iY) {
			return this.oBoardObjects[fnPosKey([iX,iY])] || [];
		},

		/**
		 * Render the board object in a cell.
		 * @param oBoardObject {BoardObject} Required. The board object to render.
		 */
		renderIn: function(oBoardObject) {
			var aPos = oBoardObject.position(),
					i, j, aListObjects, sKey;
			$(this.get.apply(this, aPos)).addClass(oBoardObject.getCellClass());

			// iterate over the position tuples and insert into the object map
			for (i = 0, j = aPos.length; i < j; i += 2) {
				sKey = fnPosKey(aPos.slice(i, i + 2));
				aListObjects = this.oBoardObjects[sKey] || [];
				aListObjects.push(oBoardObject);
				this.oBoardObjects[sKey] = aListObjects;
			}
		},

		/**
		 * Remove the board object from a cell.
		 * @param oBoardObject {BoardObject} Required. The board object to remove.
		 */
		renderOut: function(oBoardObject) {
			var aPos = oBoardObject.position(),
					i, j, sKey;

			function fnGrep(o) {
				return o !== oBoardObject;
			}

			$(this.get.apply(this, aPos)).removeClass(oBoardObject.getCellClass());

			// iterate over the position tuples and remove from the object map
			for (i = 0, j = aPos.length; i < j; i += 2) {
				sKey = fnPosKey(aPos.slice(i, i + 2));
				this.oBoardObjects[sKey] =
					$.grep(this.oBoardObjects[sKey], fnGrep);
			}
		},

		/**
		 * Load the provided map. Can re-render the board.
		 * @param aMap {array} Required. A matrix representing the game board.
		 * @param bRender {boolean} Optional. When true,
		 * will automatically call render.
		 */
		loadMap: function(aMap, bRender) {
			this.oMap = aMap;
			this.iXLen = aMap[0].length;
			this.iYLen = aMap.length;

			if (bRender) {
				this.render();
			}
		},

		/**
		 * Render the full board.
		 */
		render: function() {
			var that = this,
				aNodes = [];

			that.$node.css('visibility', 'hidden');
			that.oMatrix = [];

			// todo: consider visible region
			// render each cell on the board
			for (var i = 0, j; i < that.iXLen; i++) {
				that.oMatrix[i] = [];

				for (j = 0; j < that.iYLen; j++) {
					aNodes.push(Board.HTML.cell);
				}
			}

			// this insertion technique is substantially faster than using jQuery
			that.$node[0].innerHTML = aNodes.join('');

			// create and cache the jQuery elements, initialize the cells
			that.$node.children().each(function(i, el) {
				var $el = $(el),
					iX = i % that.iXLen,
					iY = Math.floor(i / that.iYLen);
				that.oMatrix[iX][iY] = $el;
				that._cellRenderer($el, iX, iY);
			});

			that.$node.addClass(Board.CLASS_BOARD);
			that.$node.addClass(that.sClass);
			that.$node.css('visibility', '');
		}
	};

	return Board;
}());