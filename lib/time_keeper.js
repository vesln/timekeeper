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
 * Time Keeper.
 *
 * @type {Object}
 */
var timekeeper = {};

var freeze = null;
var travel = null;
var started = null;

function applyConstructor(ctor, args) {
  var a = [];
  args = Array.prototype.slice.call(args);
  for (var i = 0; i < args.length; i++) a[i] = 'args[' + i + ']';
  return eval('new ctor(' + a.join() + ')');
};

function FakeDate() {
  if (arguments.length === 0) {
    if (freeze) return freeze;
    if (travel) return new FakeDate.super_(travel + (FakeDate.super_.now() - started));
  }
  return new applyConstructor(FakeDate.super_, arguments);
};

util.inherits(FakeDate, Date);

['parse', 'UTC'].forEach(function(method) {
  FakeDate[method] = Date[method];
});

FakeDate.now = function() {
  if (freeze) return freeze.getTime();
  if (travel) return travel + (FakeDate.super_.now() - started);
  return FakeDate.super_.now();
};

timekeeper.freeze = function(date) {
  freeze = date;
};

timekeeper.travel = function(date) {
  travel = date.getTime();
  started = FakeDate.super_.now();
};

timekeeper.reset = function() {
  freeze = null;
  started = null;
  travel = null;
};

Date = FakeDate;

module.exports = timekeeper;
