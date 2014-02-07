var ScoreBoard = (function () {
  'use strict';

  // todo: support multiple scoreboard orientations

  /**
   * The constructor for a ScoreBoard.
   * @param oBoard {BoardObject} Required. The board to render relative to.
   * @param oConf {object} Optional. The configuration for the ScoreBoard.
   * @constructor
   */
  function ScoreBoard(oBoard, oConf) {
    // initialize local shorthand
    var oCfg = oConf || {};

    // allow applications to overwrite the default class
    this.sScoreBoardCssClass =
      oCfg.sScoreBoardCssClass || ScoreBoard.DefaultClass;

    this.aPosition = oCfg.aPosition || ScoreBoard.DefaultStartPos;
    this.$board = oBoard.$node;
  }

  $.extend(ScoreBoard, {
    DefaultClass: 'ge-score-board'
  });

  ScoreBoard.prototype = {

    /**
     * Renders the scoreboard.
     */
    render: function() {
      // not rendered yet
      if (!this.$node) {
        this.$node = this.$board.after(
          '<div class="' + this.sScoreBoardCssClass + '"></div>').next();
      }

      this.update(0);
    },

    /**
     * Update the scoreboard value.
     * @param s {string} Required. The value to inject.
     */
    update: function(s) {
      this.$node.html('Score: ' + s);

      // adjust the position of the scoreboard (assume bottom right)
      this.$node.css({
        left: this.$board.offset().left + this.$board.outerWidth() -
              this.$node.outerWidth(),
        top: this.$board.offset().top + this.$board.outerHeight() + 1
      });
    }
  };

  return ScoreBoard;
}());