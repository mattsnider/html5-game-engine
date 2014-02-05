(function() {
  'use strict';

  // animation frame polyfill from http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
  (function (oWindow) {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !oWindow.requestAnimationFrame;
         ++x) {
      oWindow.requestAnimationFrame =
        oWindow[vendors[x] + 'RequestAnimationFrame'];
      oWindow.cancelAnimationFrame =
          oWindow[vendors[x] + 'CancelAnimationFrame'] ||
              oWindow[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!oWindow.requestAnimationFrame) {
      oWindow.requestAnimationFrame = function(callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = oWindow.setTimeout(function() {
              callback(currTime + timeToCall);
            },
            timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }

    if (!oWindow.cancelAnimationFrame) {
      oWindow.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
    }
  }(window));

  $.MS = {
    RX_INJECT_ARR: /\{(\d+)\}/g,
    RX_INJECT_OBJ: /\{(\w+)\}/g,

    /**
     * This is a mixin object for adding events to objects.
     */
    CE: {
      /**
       * Lazily create and fetch the sEvent, so we can monkeypatch this object.
       * @param sEvent {string} Required. The event name.
       * @return {array} An array of callback functions.
       */
      getEvent: function(sEvent) {
        if (!this.oEventMap) {
          this.oEventMap = {};
        }

        if (!this.oEventMap[sEvent]) {
          this.oEventMap[sEvent] = [];
        }

        return this.oEventMap[sEvent];
      },

      /**
       * Remove listener for a custom event. If only sEvent is provided,
       * then all callbacks for this event will be removed.
       * @param sEvent {string} Required. The event name.
       * @param fnCallback {function} Optional. The callback function.
       */
      off: function(sEvent, fnCallback) {
        console.log('unregistering event: ' + sEvent);
        var aNewList = [],
            aList = this.getEvent(sEvent);

        if (fnCallback) {
          $.each(aList, function (i, aData) {
            if (aData[0] !== fnCallback) {
              aNewList.push(aData);
            }
          });
        }

        this.oEventMap[sEvent] = aNewList;
      },

      /**
       * Listen for a custom event.
       * @param sEvent {string} Required. The event name.
       * @param fnCallback {function} Required. The callback function.
       * @param oArgs {*} Optional. Value to pass as second argument
       * to callback.
       */
      on: function(sEvent, fnCallback, oArgs) {
        console.log('registering event: ' + sEvent);
        this.getEvent(sEvent).push([fnCallback, oArgs]);
      },

      /**
       * Trigger a custom event.
       * @param sEvent {string} Required. The event name.
       * @param oMessage {*} Optional. The event message, usually text, but
       *         can be an object for more complicated events.
       */
      fire: function(sEvent, oMessage) {
        console.log('trigger event: ' + sEvent);
        var that = this;
        var dNow = new Date();

        $.each(this.getEvent(sEvent), function (i, aData) {
          aData[0].call(that, {
            message:oMessage,
            time:dNow,
            type:sEvent
          }, aData[1]);
        });
      }
    },

    /**
     * Extend functional classes.
     * @param ClassSub {function} Required. The subclass function.
     * @param ClassSuper {function} Required. The superclass function.
     * @param oMixins {Object} Optional. Any number of objects to apply to
     *         the prototype of the subclass.
     * @return {function} The subclass function.
     */
    extend: function(ClassSub, ClassSuper,
                     oMixins/*, additional objects to mix in*/) {
      // inherit prototype of superclass
      ClassSub.prototype = new ClassSuper();
      // reference to constructor
      ClassSub.prototype.constructor = ClassSub;
      // reference to parent class
      ClassSub.prototype.parent = ClassSuper;

      // initialize references for parent, if not created using extend
      if (!ClassSuper.prototype.parent) {
        ClassSuper.prototype.constructor = ClassSuper;
        ClassSuper.prototype.parent = Object;
      }

      /**
       * Shortcut to call super functions.
       * @param fnParent {function} Required. The parent constructor
       *         function. Need for ancestry lookup.
       * @param args {array} Required. The arguments to pass.
       * @param sFunction {string} Optional. The name of the function,
       *        constructor by default.
       * @return {*} Whatever is returned by call.
       */
      ClassSub.prototype.super = function(fnParent, args, sFunction) {
        return fnParent.prototype[sFunction || 'constructor'].apply(
          this, args);
      };

      // augment prototype of subclass with mix ins
      var i = 2;
      while (arguments[i]) {
        $.extend(ClassSub.prototype, arguments[i++]);
      }

      return ClassSub;
    },

    /**
     * Evaluate if the first point is equal to any of the other points.
     * @param aPosNeedle {array} Required. A point to search with.
     * @param aPosHaystack {array} Required. An array of points.
     * @param iStartIndex {int} Optional. An index to start looking in
     * haystack.
     * @return {boolean} The first points equals a point in the set of points.
     */
    pointIn: function(aPosNeedle, aPosHaystack, iStartIndex) {
      // iterate over the haystack, native array for max efficiency
      for (var i = iStartIndex || 0, j = aPosHaystack.length - 1; i < j;
           i += 1) {
        if (aPosNeedle[0] === aPosHaystack[i][0] &&
            aPosNeedle[1] === aPosHaystack[i][1]) {
          // fast return, once we match
          return true;
        }
      }

      return false;
    },

    /**
     * Evaluate if the first point is equal to any of the other points.
     * @param aPosNeedle {array} Required. A point to search with.
     * @param aPosHaystack1 {array} Required. A point point in the
     * search space.
     * @param aPosHaystackN {array} Required. Any number of additional
     *         points to compare.
     * @return {boolean} The first points equals a point in the set of points.
     */
    pointInArgs: function(aPosNeedle, aPosHaystack1, aPosHaystackN) {
      // delegate to array-based pointIn, but ignore the first
      // argument (aPosNeedle)
      return $.MS.pointIn(aPosNeedle, arguments, 1);
    },

    /**
     * Return a random integer from 1 to n
     * @param i {int} Required. The maximum integer value.
     * @return {Number} A whole number.
     */
    randomInt: function (i) {
      return Math.floor(Math.random() * i) + 1;
    },

    /**
     * Replace {*} values in the substring with those values found in the
     * oValues object/array. Use array when the {*} are digits, and an object
     * when they {*} are words (supports \w+ matches). By default, unmatched
     * values won't be replace, but setting "bReplaceEmpty" to true will
     * cause unmatched values to be replaced with empty strings.
     * @param sSource {string} The string to search and modify.
     * @param oValues {array|object} Either and array or object with key/value
     *                 pairs matching the {*} used in substring.
     * @param bReplaceEmpty {boolean} When true, will cause empty values to
     *                 be replaced with empty strings.
     * @return {string} The modified source.
     */
    stringInject: function (sSource, oValues, bReplaceEmpty) {
      // second value is an array, use array replace logic
      if ($.isArray(oValues) && (oValues.length || bReplaceEmpty)) {
        return sSource.replace($.MS.RX_INJECT_ARR, function (sSubstr, sKey) {
          var sValue = oValues[parseInt(sKey, 10)] || '';
          return sValue || bReplaceEmpty ? sValue : sSubstr;
        });
      }
      // second value is an object, use object replace logic
      else if (bReplaceEmpty || !$.isEmptyObject(oValues)) {
        return sSource.replace($.MS.RX_INJECT_OBJ, function (sSubstr, sKey) {
          var sValue = oValues[sKey] || '';
          return sValue || bReplaceEmpty ? sValue : sSubstr;
        });
      }

      return sSource;
    }
  };
}());