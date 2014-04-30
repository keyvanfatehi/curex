var request = require('request');
var moment = require('moment');
require('../../lib/readable-range.js')(moment);

var Monitor = module.exports = require('backbone').Model.extend({
  defaults: {
    frequency: 1000 * 60 * 5, // every 5 minutes
    expectStatusCode: 200,
    bodyMatchPattern: ""
  },

  normalize: function() {
    this.set('frequency', parseInt(this.get('frequency')));
    this.set('expectStatusCode', parseInt(this.get('expectStatusCode')));
  },

  initialize: function() {
    this.alertState = false;
    this.normalize();

    var banner = "Monitoring '"+this.get('name')+"' by hitting "+this.get('url')+
                " every "+(this.get('frequency') / 1000)+" seconds."+
                "\n\tExpecting status code: "+this.get('expectStatusCode');

    if (this.get('bodyMatchPattern').length > 0) {
      this.matchBody = true;
      this.banner += "\n\tExpecting body to match /"+ this.get('bodyMatchPattern')+"/";
      this.regexp = new RegExp(this.get('bodyMatchPattern'));
    }
    console.log(banner);
    this.interval_id = this.start();
  },

  start: function() {
    return setInterval(this.check.bind(this), this.get('frequency'));
  },

  check: function() {
    request(this.get('url'), function (error, response, body) {
      if (!error) {
        if (response.statusCode != this.get('expectStatusCode')) {
          this.fail("expected status code "+
                    this.get('expectStatusCode') +
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
    if (this.alertState) {
      this.alertState = false;
      var m1 = moment(new Date());
      var m2 = moment(this.alertStateTimestamp);
      var diff = moment.preciseDiff(m1, m2);
      this.attributes.alertEnded(this, diff);
      this.alertStateTimestamp = null;
    }
  },

  fail: function(error) {
    if (! this.alertState) {
      this.alertState = true;
      this.alertStateTimestamp = new Date();
      this.attributes.alertBegan(this, error);
    }
  }
});

