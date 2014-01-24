var BoardSnake = (function () {
	'use strict';

	var Boundary = $.MS.extend(function Boundary(el, oConf) {
		// initialize local shorthand
		var oCfg = oConf || {};
		this.super(BoardObject, arguments);

		// allow applications to overwrite the default class
		this.sBoundaryCssClass =
				oCfg.sBoundaryCssClass || Boundary.DefaultClass;
	}, BoardObject, {
		// @override
		getCellClass: function() {
			return this.super(BoardObject, arguments, 'getCellClass') + ' ' +
					this.sBoundaryCssClass;
		}
	});

	$.extend(Boundary, {
		DefaultClass: 'ge-board-snake-invalid'
	});

	return $.MS.extend(function BoardSnake(el, oConf) {
		this.super(Board, arguments);
	}, Board, {
		iXLen: 25,
		iYLen: 25,

		sClass: 'ge-board-snake',
		sClassCell: 'ge-board-cell-snake',

		_getCellClasses: function(iX, iY) {
			var s = this.super(Board, arguments, '_getCellClasses');

			if (this.oMap) {
				switch(this.oMap[iX][iY]) {
					case ' ':
						return s + '';
					case '*':
						var o = new Boundary({aPosition: [iX, iY]});
						this.renderIn(o);
						return s;
					default:
						return s + ' ge-board-cell-unknown';
				}
			}

			return s;
		}
	});
}());