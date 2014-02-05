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
    getCellClass: function () {
      return this.super(BoardObject, arguments, 'getCellClass') + ' ' +
             this.sBoundaryCssClass;
    }
  });

  $.extend(Boundary, {
    DefaultClass: 'ge-board-snake-invalid'
  });

  var BoardSnake = $.MS.extend(function BoardSnake(el, oConf) {
    this.super(Board, arguments);
  }, Board, {
    iXLen: 25,
    iYLen: 25,

    sClass: 'ge-board-snake',
    sClassCell: 'ge-board-cell-snake',

    // @override
    generateMap: function (oOpts) {
      var oOptions = oOpts || {};
      var aExcludedPositions = oOpts.aExcludedPositions || [];
      var bHasExcludedPositions = !!aExcludedPositions.length;
      $.extend(oOptions, BoardSnake.DefaultMapOptions);
      var aMap = this.super(Board, [oOptions], 'generateMap');
      // max number of cycles, in case iNumInternalWall is ridiculously large,
      // zero is used to indicate no internal walls should be built
      var iWhileLimit = oOptions.iNumInternalWall ? this.iXLen * this.iYLen : 0;
      var i = 0;
      var iX, iY;

      while (iWhileLimit-- && i < oOptions.iNumInternalWall) {
        iX = $.MS.randomInt(this.iXLen) - 1;
        iY = $.MS.randomInt(this.iYLen) - 1;

        // check that this is not an excluded position
        if (bHasExcludedPositions) {
          // if the current point is excluded, then continue
          if ($.MS.pointIn([iX, iY], aExcludedPositions)) {
            continue;
          }
        }

        if (' ' === aMap[iX][iY]) {
          aMap[iX][iY] = '*';
          i += 1;
        }
      }

      var iNumPowerUp = oOptions.iNumPowerUp;
      return aMap;
    },

    // @override
    _getCellClasses: function (iX, iY) {
      var s = this.super(Board, arguments, '_getCellClasses');

      if (this.oMap) {
        switch (this.oMap[iX][iY]) {
          case ' ':
            return s + '';
          case '*':
            // todo: this is probably the wrong place for initializing boundaries
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

  $.extend(BoardSnake, {
    DefaultMapOptions: {
      aExcludedPositions: null,
      bApplyBorder: true,
      iNumPowerUp: 1,
      iNumInternalWall: 5
    }
  });

  return BoardSnake;
}());