/**
 * Time keeper - Easy time-dependent code tests
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License.
 */

/**
 * Support
 */
var should = require('chai').should();
var jack = require('jack');

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) break;
  }
};

/**
 * Context.
 */
var tk = require('../lib/time_keeper');

describe('TimeKeeper', function() {
  describe('freeze', function() {
    describe('when frozen', function() {
      beforeEach(function() {
        this.time = new Date(1330688329321);
        tk.freeze(this.time);
      });

      it('freezes the time create with `new Date` to the supplied one', function() {
        sleep(50);
        var date = new Date;
        date.getTime().should.eql(this.time.getTime());
        tk.reset();
      });

      it('freezes the time create with `Date.new` to the supplied one', function() {
        sleep(50);
        Date.now().should.eql(this.time.getTime());
        tk.reset();
      });

      it('should not affect other date calls', function() {
        tk.freeze(this.time);
        (new Date(1330688329320)).getTime().should.eql(1330688329320);
        tk.reset();
      });
    });
  });

  describe('travel', function() {
    describe('when traveled', function() {
      
    });
  });
});
