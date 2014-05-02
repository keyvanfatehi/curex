var util = require('util');
var http = require('http');
var https = require('https');
var moment = require('moment');
require('../../lib/3rd_party/readable-range.js')(moment);

var Monitor = module.exports = require('backbone').Model.extend({
  defaults: {
    name: "unnamed",
    frequency: 1000 * 60 * 5, // every 5 minutes
    expectStatusCode: 200,
    raven: false
  },

  initialize: function() {
    this.set('frequency', parseInt(this.get('frequency')));
    this.set('expectStatusCode', parseInt(this.get('expectStatusCode')));
    this.proto = null;
    if (/^https/.test(this.get('url'))) {
      this.proto = https;
    } else if (/^http/.test(this.get('url'))) {
      this.proto = http;
    } else {
      throw new Error("unknown protocol!");
    }
    this.alertState = false;

    var banner = "Monitoring '"+this.get('name')+"' by hitting "+this.get('url')+
                " every "+(this.get('frequency') / 1000)+" seconds."+
                "\n\tExpecting status code: "+this.get('expectStatusCode');

    if (typeof this.attributes.expectMatchBody === "object") {
      this.pattern = this.attributes.expectMatchBody;
      this.matchBody = true;
      banner += "\n\tExpecting body to match "+ this.pattern.toString();
    }
    console.log(banner);
  },

  start: function() {
    this.check();
    this.interval_id = this.start();
    return setInterval(this.check.bind(this), this.get('frequency'));
  },

  check: function() {
    this.proto.get(this.get('url'), function (response) {
    }).on('error', function(e) {
      if (response.statusCode != this.get('expectStatusCode')) {
        this.fail("expected status code "+
                  this.get('expectStatusCode') +
                  " but got "+response.statusCode, body);
      }
    });
      /*
      if (!error) {
        if (response.statusCode != this.get('expectStatusCode')) {
          this.fail("expected status code "+
                    this.get('expectStatusCode') +
                    " but got "+response.statusCode, body);
        } else {
          if (this.matchBody) {
            if (this.pattern.test(body)) {
              this.success();
            } else {
              this.fail("expected body to match "+this.pattern.toString(), body);
            }
          } else {
            // any other contingencies? no? then success is fine
            this.success();
          }
        }
      } else {
        this.fail(error, body);
      }
    }.bind(this)); */
  },

  finish: function() {
    clearInterval(this.interval_id);
  },

  alert: function(down, details) {
    if (down) {
      this.alertState = true;
      this.alertStateTimestamp = new Date();
    } else {
      this.alertState = false;
      var m1 = moment(new Date());
      var m2 = moment(this.alertStateTimestamp);
      this.set('downtime') = moment.preciseDiff(m1, m2);
    }
    var message = "Downtime alert "+(this.alertState ? "began" : "ended")+" for "+this.get('name')+" @ "+this.get('url');
    if (typeof details !== "undefined") {
      message += " -- "+util.format(details);
    }
    return message;
  },

  success: function() {
    if (this.alertState) {
      var message = this.alert(true);
      try {
        this.attributes.alertEnded(this.get('downtime'), message);
      } catch (e) {
        console.log("alertEnded is unused");
      }
      this.alertStateTimestamp = null;
    }
  },

  fail: function(error, body) {
    var details = {error: error, body: body};
    if (! this.alertState) {
      var message = this.alert(true, error);
      try {
        this.attributes.alertBegan(details, message);
      } catch(e) {
        console.log("alertBegan is unused");
      }
    }
  },

  sendRaven: function(message) {
    try {
      this.ravenClient.captureMessage(message, {
        level: (this.alertState ? "fatal" : "info")
      })
    } catch(e) {
      console.error("Failed to send raven", e);
    }
  },

  setupRaven: function() {
    if (!this.get('raven')) {  return; }
    var raven;
    try {
      raven = require('raven');
    } catch (e) {
      console.error("You must install module `raven` in order to use it");
    }
    try {
      this.ravenClient = new raven.Client(this.get('raven'))
    } catch (e) {
      console.error("Failed to create raven client", e);
    }
  }
});
