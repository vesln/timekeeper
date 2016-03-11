/**
 * Time keeper - Easy testing of time-dependent code.
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License.
 */
describe('TimeKeeper', function() {
  // Wait 10ms
  function wait(cb) {
    setTimeout(cb, 10);
  }

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
        var _this = this;

        wait(function() {
          var date = new Date;
          date.getTime().should.eql(_this.time.getTime());
          done();
        });
      });

      it('freezes the time create with `Date#now` to the supplied one', function(done) {
        var _this = this;

        wait(function() {
          Date.now().should.eql(_this.time.getTime());
          done();
        });
      });

      it('should not affect other date calls', function() {
        tk.freeze(this.time);
        (new Date(1330688329320)).getTime().should.eql(1330688329320);
      });

      it('should return distinct frozen date objects', function() {
        (new Date()).should.not.equal(new Date());
      });
    });

    describe('when frozen', function() {
      beforeEach(function() {
        this.time = new Date(1330688329321);
      });

      afterEach(function() {
        tk.reset();
      });

      it('should only return the frozen time N times', function(done) {
        var _this = this;

        tk.freeze(this.time, { count: 1 });

        wait(function() {
          var date = new Date(), date1 = new Date();

          date.getTime().should.equal(_this.time.getTime());
          date1.getTime().should.be.greaterThan(_this.time.getTime());
          done();
        });
      });
    });
  });

  describe('travel', function() {
    describe('when traveled', function() {
      beforeEach(function(done) {
        this.time = new Date(1923701040000); // 2030
        tk.travel(this.time);
        wait(done);
      });

      describe('and used with `new Date`', function() {
        it('should set the current date time to the supplied one', function() {
          (new Date).getTime().should.be.greaterThan(this.time.getTime());
          tk.reset();
        });
      });

      describe('and used with `Date#now`', function() {
        it('should set the current date time to the supplied one', function() {
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
