var CharacterSnake = (function () {
  'use strict';

  var CharacterSnake = $.MS.extend(function CharacterSnake(el, oConf) {
    this.super(Character, arguments);
  }, Character, {
    // @override
    getCellClass: function() {
      return this.super(Character, arguments, 'getCellClass') + ' ' +
             CharacterSnake.DefaultClass;
    },

    increaseSize: function() {
      this.aPosition.unshift(undefined, undefined);
    },

    // @override
    position: function(iX, iY, iXn, iYn) {
      if ((iX || 0 === iX) && (iY || 0 === iY)) {
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

  $.extend(CharacterSnake, {
    DefaultClass: 'ge-board-snake-character',
    DefaultStartPosition: [0, 1]
  });

  return CharacterSnake;
}());