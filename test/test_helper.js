var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
global.sinon = require('sinon');
global.expect = chai.expect;

var http = require('http');
var https = require('https');

module.exports = function(monitor) {
  var testServer = null;
  var testServerURL = function() {
    return "http://localhost:"+testServer.address().port;
  };

  this.http = http;
  this.https = https;

  this.startTestServer = function(cb) {
    if (testServer !== null) { throw new Error("test server is running") };
    http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end("Curex");
    }).listen(0, function() {
      cb(testServerURL());
    });
  };

  this.stopTestServer = function(cb) {
    if (testServer === null) { throw new Error("test server is not running") };
    s.close(cb);
  };

  this.stubNetwork = function() {
    stubRequest(http, 'get');
    stubRequest(https, 'get');
  };

  this.restoreNetwork = function() {
    http.get.restore();
    https.get.restore();
  };

  this.fakeNet = function(cb) {
    this.stubNetwork();
    cb();
    this.restoreNetwork();
  };

  // exists to avoid the quick check
  // at the beginning, this way we can control
  // the call to check() ourselves in tests,
  // spying on it after returned by this method
  this.newMonitor = function(opts) {
    h.stubNetwork();
    var mon = new Monitor(opts);
    monitor.finish();
    h.restoreNetwork();
    return mon;
  }
}

var stubRequest = function (proto, method) {
  sinon.stub(proto, method).
    returns({
    on: sinon.stub() // hook on('error')
  }).callsArgWith(1, "response");
}
