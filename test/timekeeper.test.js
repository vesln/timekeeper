/**
 * Time keeper - Easy testing of time-dependent code.
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License.
 */

describe('TimeKeeper', function() {
  describe('freeze', function() {
    describe('when frozen', function() {
      beforeEach(function() {
        this.time = new Date(1330688329321);
        tk.freeze(this.time);
      });

      afterEach(function() {
        tk.reset();
      });

      it('freezes the time create with `new Date` to the supplied one', function(done) {
        setTimeout(function(time) {
          var date = new Date();
          date.getTime().should.eql(time.getTime());
          done();
        }, 10, this.time);
      });

      it('freezes the time create with `Date#now` to the supplied one', function(done) {
        setTimeout(function(time) {
          Date.now().should.eql(time.getTime());
          done();
        }, 10, this.time);
      });

      it('should not affect other date calls', function() {
        tk.freeze(this.time);
        (new Date(1330688329320)).getTime().should.eql(1330688329320);
      });

      it('should be immutable', function() {
        var firstDate = new Date();
        firstDate.setFullYear(2001);
        var secondDate = new Date();
        secondDate.getFullYear().should.not.equal(2001);
      })
    });
  });

  describe('travel', function() {
    describe('when traveled', function() {
      beforeEach(function() {
        this.time = new Date(1923701040000); // 2030
        tk.travel(this.time);
      });

      afterEach(function() {
        tk.reset();
      });

      describe('and used with `new Date`', function() {
        it('should set the current date time to the supplied one', function(done) {
          setTimeout(function(time) {
            (new Date).getTime().should.be.greaterThan(time.getTime());
            done();
          }, 10, this.time);
        });
      });

      describe('and used with `Date#now`', function() {
        it('should set the current date time to the supplied one', function(done) {
          setTimeout(function(time) {
            Date.now().should.be.greaterThan(time.getTime());
            done();
          }, 10, this.time);
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
