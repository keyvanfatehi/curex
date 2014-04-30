curex
---

a simple http service monitoring daemon

### install:

`npm install -g curex`

### usage:

0. create a config script somewhere, like the example below
0. run `curex -c path/to/config_script.js`

you can change your config script anytime, it will be re-evaluated

### example config

feel free to do whatever you want in the config file, call out to your other softwre, etc...

```javascript
module.exports = {
  my_app: {
    url: "http://my.app.com/sanitycheck",
    frequency: 1000 * 60 * 5, // how often to make a request (optional, defaults to 5 minutes)
    expectStatusCode: 200, // http status code (optional, defaults to 200)
    expectMatchBody: new RegExp("all good in the hood"), // (optional, doesn't check body by default)
    alertBegan: function(reason) {
      // reason could be a string or an object
      // e.g. require('sms_sender').sendSMS(1234567890, "my app is down!!!");
      // or perhaps send a Raven with https://github.com/getsentry/raven-node
    },
    alertEnded: function(downtime) {
      // downtime is a human-readable string. e.g. "4 minutes 5 seconds"
      // let yourself know everything is ok now
    }
  },
  my_other_app: {
    // and so on ...
  }
};
```
