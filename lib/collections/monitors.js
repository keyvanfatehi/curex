var Monitor = require('../models/monitor.js');

var Monitors = module.exports = require('backbone').Collection.extend({
  model: Monitor
});
