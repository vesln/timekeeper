/**
 * Time keeper - EEasy testing of time-dependent code.
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License.
 */

/**
 * Native Date constructor reference.
 *
 * @type {Object}
 */
var NativeDate = Date;

/**
 * Native setTimeout reference.
 *
 * @type {Function}
 */
var nativeSetTimeout = setTimeout;

/**
 * Native clearTimeout reference.
 *
 * @type {Function}
 */
var nativeClearTimeout = clearTimeout;

/**
 * Collection of timeouts and times they should run
 *
 * @type {Object}
 */
var timeouts = [];


/**
 * `TimeKeeper`.
 *
 * @type {Object}
 */
var timekeeper = {};

/**
 * Frozen date time container.
 *
 * @type {Object}
 */
var freeze = null;

/**
 * Fake date time container.
 *
 * @type {Number}
 */
var travel = null;

/**
 * Travel start container.
 *
 * @type {Number}
 */
var started = null;

/**
 * Return the elapsed time.
 *
 * @returns {Number}
 */
function time() {
  return travel + (NativeDate.now() - started);
}

/**
 * `FakeDate` constructor.
 */
function FakeDate(Y, M, D, h, m, s, ms) {
    var length = arguments.length;

    if (this instanceof NativeDate) {

        if (!length && freeze) return freeze;
        if (!length && travel) return new NativeDate(time());

        var date = length == 1 && String(Y) === Y ? // isString(Y)
            // We explicitly pass it through parse:
            new NativeDate(NativeDate.parse(Y)) :
            // We have to manually make calls depending on argument
            // length here
            length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) :
            length >= 6 ? new NativeDate(Y, M, D, h, m, s) :
            length >= 5 ? new NativeDate(Y, M, D, h, m) :
            length >= 4 ? new NativeDate(Y, M, D, h) :
            length >= 3 ? new NativeDate(Y, M, D) :
            length >= 2 ? new NativeDate(Y, M) :
            length >= 1 ? new NativeDate(Y) :
                          new NativeDate();
        // Prevent mixups with unfixed Date object
        date.constructor = NativeDate;
        return date;
    }
    return NativeDate.apply(this, arguments);
}

// Copy any custom methods a 3rd party library may have added
(function() {
  for (var key in NativeDate) {
      FakeDate[key] = NativeDate[key];
  }
}());

// Copy "native" methods explicitly; they may be non-enumerable
FakeDate.UTC = NativeDate.UTC;
FakeDate.parse = NativeDate.parse;

// Setup inheritance
FakeDate.prototype = NativeDate.prototype;
FakeDate.prototype.constructor = NativeDate;


/**
 * Replace the original now method.
 *
 * Check if the time is
 *
 *  - frozen and if so return the frozen time
 *  - faked and if so return the elapsed time
 *
 * @returns {Number}
 * @api public
 */
FakeDate.now = function() {
  if (freeze) return freeze.getTime();
  if (travel) return time();
  return NativeDate.now();
};

/**
 * Fake set timeout
 *
 * Stores timeouts to be run for pausing and restarting
 *
 * @returns {Object}
 * @api public
 */
function fakeSetTimeout( func, delay ) {
  var timeout = {
    hasRun: false,
    canceled: false,
    shouldRunAt: Date.now() + delay,
    args: Array.prototype.slice.call( arguments, 2 ),
    run: function() {
      if( !timeout.canceled && !timeout.hasRun ) {
        timeout.hasRun = true;
        timeouts.splice( timeouts.indexOf( timeout ), 1 );
        func.apply( null, timeout.args );
      }
    },
  };
  timeouts.push( timeout );
  if(!freeze) {
    timeout.timeout = nativeSetTimeout( timeout.run, delay );
  }
  return timeout;
};

//For testing purposes
timekeeper.nativeSetTimeout = nativeSetTimeout;

/**
 * Fake clear timeout
 *
 * Deletes a stored timeout
 *
 * @api public
 */
function fakeClearTimeout( timeout ) {
  if( !timeout.hasRun ) {
    timeout.canceled = true;
    nativeClearTimeout( timeout.timeout );
    timeouts.splice( timeouts.indexOf( timeout ), 1 );
  }
}

/**
 * Stop all pending timeouts and wait for time to start again
 *
 */

function freezeTimeouts() {
  for( var i = timeouts.length - 1; i >= 0; i-- ) { //Go backwards in case we get spliced externally
    var timeout = timeouts[i];
    if( timeout ) {
      nativeClearTimeout( timeout.timeout );
    }
  }
}

/**
 * Reschedule timeouts based on new time information
 *
 */

function restartTimeouts() {
  var now = Date.now();
  for( var i = timeouts.length - 1; i >= 0; i-- ) { //Go backwards in case we get spliced externally
    var timeout = timeouts[i];
    if( timeout ) {
        nativeClearTimeout( timeout.timeout );
        var newDelay = timeout.shouldRunAt - now;
        if( newDelay < 0 ) {
          newDelay = 0;
        }
        timeout.timeout = nativeSetTimeout( timeout.run, newDelay );
    }
  }
}

/**
 * Set current Date Tieme and freeze it.
 *
 * @param {Object|String|Number} Date.
 * @api public
 */
timekeeper.freeze = function(date) {
  useFakeDate();

  if (typeof date !== 'object') {
    date = new NativeDate(date);
  }
  travel = null;
  started = null;
  freeze = date;
  freezeTimeouts();
};

/**
 * Set current DateTime.
 *
 * @param {Object|String|Number} Date.
 * @api public
 */
timekeeper.travel = function(date) {
  useFakeDate();

  if (typeof date !== 'object') {
    date = new NativeDate(date);
  }
  freeze = null;
  travel = date.getTime();
  started = NativeDate.now();
  restartTimeouts();
};

/**
 * Reset the `timekeeper` behavior.
 *
 * @api public
 */
timekeeper.reset = function() {
  useNativeDate();
  freeze = null;
  started = null;
  travel = null;
  restartTimeouts();
};

/**
 * Reflection: Are we currently modifying the native Date object?
 *
 * @api public
 */
timekeeper.isKeepingTime = function() {
  return Date === FakeDate;
};

/**
 * Replace the `Date` with `FakeDate`.
 */
function useFakeDate() {
  Date = FakeDate;
  setTimeout = fakeSetTimeout;
  clearTimeout = fakeClearTimeout;
}

/**
 * Restore the `Date` to `NativeDate`.
 */
function useNativeDate() {
  Date = NativeDate;
  setTimeout = nativeSetTimeout;
  clearTimeout = nativeClearTimeout;
  restartTimeouts();
}


/**
 * Expose `timekeeper`
 */
module.exports = timekeeper;
