curex
---

a simple http service monitoring program to help you cure your extremely annoying downtime issues -- be sure to have error reporting and logging, otherwise you'll be pretty bummed when the service is down, curex lets you know, and you have no idea what to do ;)

### usage:

0. `npm install curex -g`
0. create a config.js file anywhere -- see example below
0. run `curex path/to/config.js` to monitor your services

you can change your config.js anytime, it will be re-evaluated

### example config

feel free to do whatever you want in the config file, call out to your other softwre, etc...

```javascript
module.exports = {
  my_app: {
    url: "http://my.app.com/sanitycheck",
    frequency: 1000 * 60 * 5, // how often to make a request (optional, defaults to 5 minutes)
    expectStatusCode: 200, // http status code (optional, defaults to 200)
    expectMatchBody: new RegExp("all good in the hood"), // (optional, doesn't check body by default)
    alertBegan: function() {
      // mon is a backbone model representing the server monitor
      // e.g. require('sms_sender').sendSMS(1234567890, "my app is down!!!");
      // or perhaps send a Raven (getsentry.com)
    },
    alertEnded: function(downtime) {
      // find a way to calm yourself, everything is cool now, your checks were good
      // downtime is a human-readable string. e.g. "4 minutes 5 seconds"
    }
  },
  my_other_app: {
    // and so on ...
  }
};
```

