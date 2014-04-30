var request = require('request');

module.exports = Monitor = require('backbone').Model.extend({
  defaults: {
    frequency: 1000 * 60 * 5, // every 5 minutes
    expectStatusCode: 200
  },

  initialize: function() {
    console.log("Monitoring "+this.get('url'));
    this.interval_id = this.start();
    this.expectStatusCode = parseInt(this.get('expectStatusCode'));
  },

  start: function() {
    return setInterval(this.check.bind(this), this.get('frequency'));
  },

  check: function() {
    request(this.get('url'), function (error, response, body) {
      if (!error) {
        if (response.statusCode != this.expectStatusCode) {
          this.fail("expected status code "+
                    this.expectStatusCode  +
                    " but got "+response.statusCode);
        } else {
          // any other contingencies? no? then success is fine
          this.success(body);
        }
      } else {
        this.fail(error);
      }
    }.bind(this));
  },

  finish: function() {
    clearInterval(this.interval_id);
    console.log("Finished");
  },

  success: function(body, response) {
  },

  fail: function(error) {
  }
});

