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
  my_service: {
    url: "http://localhost:4323/sanitycheck",
    frequency: 1000 * 60 * 5, // every 5 minutes (optional, default)
    expectStatusCode: 200 // http status code (optional, default)
    fn: {
      alertBegan: function(mon) {
        // mon is a backbone model representing the server monitor
        var n = mon.get('name') //= "my_service"
        // e.g. require('sms_sender').sendSMS(1234567890, n+" is down!!!");
      },
      alertEnded: function(downtime) {
        // calm yourself, everything is cool now
      }
    }
  }
};
```

