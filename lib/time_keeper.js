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

function applyConstructor(ctor, args) {
  var a = [];
  args = Array.prototype.slice.call(args);
  for (var i = 0; i < args.length; i++) a[i] = 'args[' + i + ']';
  return eval('new ctor(' + a.join() + ')');
};

function FakeDate() {
  if (arguments.length === 0 && freeze) return freeze;
  return new applyConstructor(FakeDate.super_, arguments);
};

util.inherits(FakeDate, Date);

['parse', 'UTC'].forEach(function(method) {
  FakeDate[method] = Date[method];
});

FakeDate.now = function() {
  if (freeze) return freeze.getTime();
  return FakeDate.super_.now();
};

timekeeper.freeze = function(date) {
  freeze = date;
};

timekeeper.reset = function() {
  freeze = null;
};

global.Date = FakeDate;

module.exports = timekeeper;
