var CharacterSnake = (function () {
	'use strict';

	return $.MS.extend(function CharacterSnake(el, oConf) {
		this.super(Character, arguments);
	}, Character, {

		increaseSize: function() {
			this.aPosition.unshift(undefined, undefined);
		},

		// @override
		position: function(iX, iY, iXn, iYn) {
			if (iX && iY) {
				if (this.aPosition[0] === undefined) {
					this.aPosition[0] = iX;
					this.aPosition[1] = iY;
				}
				else {
					this.aPosition.pop();
					this.aPosition.pop();
					this.aPosition.unshift(iX, iY);
				}
			}

			return this.aPosition;
		}
	});
}());