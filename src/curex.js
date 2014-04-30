var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var chokidar = require('chokidar');
var Monitors = require('./collections/monitors.js');
var monitors = new Monitors();
var configPath;
var config;


module.exports = {

  checkConfig: function(argv) {
    configPath = path.resolve(argv.config);
    if (fs.existsSync(configPath)) {
      try {
        config = require(configPath);
      } catch (e) {
        console.error(e);
        return false;
      }
    } else {
      console.error("No such file "+configPath);
      return false;
    }
  },

  watchConfig: function() {
    var watcher = chokidar.watch(configPath, { persistent: true });
    watcher.on('change', function(path, stats) {
      try {
        console.log("loading new configuration");
        monitors.each(function(mon) { mon.finish() });
        monitors = new Monitors();
        start();
      } catch (e) {
        console.error(e);
      }
    });
  },

  startMonitoring: function() {
    try {
      var config = require(configPath);
      if (Object.keys(config).length === 0) {
        console.error("define some stuff to monitor in "+configPath);
      }
      _.each(config, function(value, key) {
        try {
          monitors.add(_.extend(value, {name: key}));
        } catch (e) {
          console.error(e);
        }
      });
    } catch (e) {
      console.error(e);
    }
  }
}
