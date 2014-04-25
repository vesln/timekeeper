/**
 * Time keeper - Easy testing of time-dependent code.
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License.
 */

/**
 * Sleep implementation.
 *
 * Thanks to Stoyan Stefanov.
 * http://www.phpied.com/sleep-in-javascript/
 *
 * @param {Number} Milliseconds.
 */
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) break;
  }
};

describe('TimeKeeper', function() {
  describe('freeze', function() {
    describe('when frozen', function() {
      beforeEach(function() {
        this.time = new Date(1330688329321);
        tk.freeze(this.time);
      });

      it('freezes the time create with `new Date` to the supplied one', function() {
        sleep(10);
        var date = new Date;
        date.getTime().should.eql(this.time.getTime());
        tk.reset();
      });

      it('freezes the time create with `Date#now` to the supplied one', function() {
        sleep(10);
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
      beforeEach(function() {
        this.time = new Date(1923701040000); // 2030
        tk.travel(this.time);
        sleep(10);
      });

      describe('and used with `new Date`', function() {
        it('should set the current date time to the supplied one', function() {
          (new Date).getTime().should.be.greaterThan(this.time.getTime());
          tk.reset();
        });
      });

      describe('and used with `Date#now`', function() {
        it('should set the current date time to the supplied one', function() {
          sleep(10);
          Date.now().should.be.greaterThan(this.time.getTime());
          tk.reset();
        });
      });
    });
  });

  describe('inheritance', function() {
    describe('should create an instance of Date', function() {
      (new Date instanceof Date).should.be.eql(true);
    });
  });

  describe('reflection', function() {
    it('should know if time is being modified', function() {
      tk.isKeepingTime().should.be.eql(false);
      tk.freeze(new Date(1330688329321));
      tk.isKeepingTime().should.be.eql(true);
      tk.reset();
      tk.isKeepingTime().should.be.eql(false);
    });
  });
});
