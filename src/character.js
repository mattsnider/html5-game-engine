var Character = (function () {
  'use strict';

  var Character = $.MS.extend(function(oConf) {
    this.super(BoardObject, arguments);

    // allow applications to overwrite the default class
    if (undefined === this.oCfg.sCharacterCssClass) {
      this.oCfg.sCharacterCssClass = Character.DefaultClass;
    }
  }, BoardObject, {
    // @override
    getCellClass: function() {
      return this.super(BoardObject, arguments, 'getCellClass') + ' ' +
             this.oCfg.sCharacterCssClass;
    }
  });

  $.extend(Character, {
    DefaultClass: 'ge-board-character'
  });

  return Character;
}());