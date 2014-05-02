module.exports = {
  "example check": {
    url: "http://localhost:3000",
    frequency: 2000, // how often to make a request (optional, defaults to 5 minutes)
    expectStatusCode: 200, // http status code (optional, defaults to 200)
    expectMatchBody: /ok/, // (optional, doesn't check body by default)
    alertBegan: function(json, message) {
      // json contains the error and body
      // message contains a human readable message with name and URL
      // e.g. require('sms_sender').sendSMS(1234567890, "my app is down!!!");
      // for raven support check the other config example
    },
    alertEnded: function(downtime, message) {
      // message is a human readable message with name and URL
      // downtime is a human-readable string. e.g. "4 minutes 5 seconds"
      // let yourself know everything is ok now
    }
  },
  my_other_app: {
    // and so on ...
  }
};
