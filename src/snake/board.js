var BoardSnake = (function () {
  'use strict';

  var Boundary = $.MS.extend(function Boundary(el, oConf) {
    this.super(BoardObject, arguments);

    // allow applications to overwrite the default class
    if (undefined === this.oCfg.sBoundaryCssClass) {
      this.oCfg.sBoundaryCssClass = Boundary.DefaultClass;
    }
  }, BoardObject, {
    // @override
    getCellClass: function () {
      return this.super(BoardObject, arguments, 'getCellClass') + ' ' +
             this.oCfg.sBoundaryCssClass;
    }
  });

  $.extend(Boundary, {
    DefaultClass: 'ge-board-snake-invalid'
  });

  var BoardSnake = $.MS.extend(function BoardSnake(el, oConf) {
    // ensure the map is defined, will modify argument
    oConf = oConf || {};
    if (!oConf.map) {
      oConf.map = {};
    }
    $.extend(oConf.map, BoardSnake.DefaultMapOptions);

    this.super(Board, [el, oConf]);
  }, Board, {
    iXLen: 25,
    iYLen: 25,

    sClass: 'ge-board-snake',
    sClassCell: 'ge-board-cell-snake',

    // @override
    generateMap: function (oOpts) {
      var oOptions = this.oCfg.map || {};
      $.extend(oOptions, oOpts);
      var aExcludedPositions = oOptions.aExcludedPositions || [];
      var bHasExcludedPositions = !!aExcludedPositions.length;
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
      iNumPowerUp: 1, // todo: use this variable
      iNumInternalWall: 5
    }
  });

  return BoardSnake;
}());