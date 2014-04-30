var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var chokidar = require('chokidar');
var Monitors = require('./collections/monitors.js');
var monitors = new Monitors();

var configPath = "";
var config = null;

module.exports = {
  // check config file
  loadConfig: function(argv) {
    configPath = path.resolve(argv.config);
    if (fs.existsSync(configPath)) {
      try {
        if (config !== null) {
          delete require.cache[require.resolve(configPath)]
        }
        config = require(configPath);
        if (Object.keys(config).length === 0) {
          console.error("define some stuff to monitor in "+configPath);
          return false;
        } else {
          return true;
        }
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
    watcher.on('change', function(filename, stats) {
      if (this.loadConfig({config: configPath})) {
        try {
          console.log("applied new config");
          monitors.each(function(mon) { mon.finish() });
          monitors = new Monitors();
          this.start();
        } catch (e) {
          console.error(e);
        }
      } else {
        console.log("bad config! go fix it");
      }
    }.bind(this));
  },

  start: function() {
    try {
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
