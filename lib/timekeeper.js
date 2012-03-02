/**
 * Time keeper - Easy time-dependent code tests
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License.
 */

/**
 * Dependencies.
 */
var util = require('util');

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
 * Helper function that creates a new instance with
 * supplied arguments.
 *
 * @param {Function} Constructor.
 * @param {Object} Arguments.
 * @returns {Object}
 */
function create(ctor, args) {
  var a = [];
  args = Array.prototype.slice.call(args);
  for (var i = 0; i < args.length; i++) a[i] = 'args[' + i + ']';
  return eval('new ctor(' + a.join() + ')');
};

/**
 * Return the elapsed time.
 *
 * @returns {Number}
 */
function ms() {
  return travel + (FakeDate.super_.now() - started);
};

/**
 * `FakeDate` constructor.
 */
function FakeDate() {
  var args = arguments.length === 0;
  if (args && freeze) return freeze;
  if (args && travel) return new FakeDate.super_(ms());
  return new create(FakeDate.super_, arguments);
};

/**
 * `FakeDate` inheris from `Date`.
 */
util.inherits(FakeDate, Date);

/**
 * Attach `Date` class methods to `FakeDate` except `Date#now`.
 */
['parse', 'UTC'].forEach(function(method) {
  FakeDate[method] = Date[method];
});

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
  if (travel) return ms();
  return FakeDate.super_.now();
};

/**
 * Set current Date Tieme and freeze it.
 *
 * @param {Object} Date.
 * @api public
 */
timekeeper.freeze = function(date) {
  freeze = date;
};

/**
 * Set current DateTime.
 *
 * @param {Object} Date.
 * @api public
 */
timekeeper.travel = function(date) {
  travel = date.getTime();
  started = FakeDate.super_.now();
};

/**
 * Reset the `timekeeper` behavior.
 *
 * @api public
 */
timekeeper.reset = function() {
  freeze = null;
  started = null;
  travel = null;
};

/**
 * Replace the `Date` with `FakeDate`.
 */
Date = FakeDate;

/**
 * Expose `timekeeper`
 */
module.exports = timekeeper;
