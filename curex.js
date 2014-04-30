var Backbone = require('backbone');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var chokidar = require('chokidar');


var Monitor = require('./models/monitor.js');
var MonitorCollection = Backbone.Collection.extend({ model: Monitor });
var monitorCollection = new MonitorCollection();


var configPath = path.resolve(process.argv[2]);

if (! fs.existsSync(configPath)) {
  console.error("requires a javascript configuration file as an argument");
  process.exit(2);
}

var watcher = chokidar.watch(configPath, { persistent: true });
watcher.on('change', function(path, stats) {
  console.log("loading new configuration");
  monitorCollection.each(function(mon) { mon.finish() });
  monitorCollection = new MonitorCollection();
  start();
});

function start() {
  var config = require(configPath);
  if (Object.keys(config).length === 0) {
    console.error("define some stuff to monitor in "+configPath);
    process.exit(2);
  }
  _.each(config, function(value, key) {
    monitorCollection.add(_.extend(value, {name: key}));
  });
}

start();
