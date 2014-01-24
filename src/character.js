var Character = (function () {
	'use strict';

	var Character = $.MS.extend(function(oConf) {
		// initialize local shorthand
		var oCfg = oConf || {};
		this.super(BoardObject, arguments);

		// allow applications to overwrite the default class
		this.sCharacterCssClass =
				oCfg.CharacterCssClass || Character.DefaultClass;
	}, BoardObject, {
		// @override
		getCellClass: function() {
			return this.super(BoardObject, arguments, 'getCellClass') + ' ' +
					this.sCharacterCssClass;
		}
	});

	$.extend(Character, {
		DefaultClass: 'ge-board-character'
	});

	return Character;
}());