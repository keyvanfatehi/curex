var TestHelper = require('./test_helper.js')
var Monitor = require('../src/models/monitor.js');

describe("Monitor", function() {
  var monitor = null;
  var h = new TestHelper();


  describe("initialize", function() {
    it("throws an error if not given a url with a supported protocol", function() {
      expect(function() { new Monitor() }).to.throw();
      expect(function() { new Monitor({url:"http"}) }).not.to.throw();
      expect(function() { new Monitor({url:"https"}) }).not.to.throw();
      expect(function() { new Monitor({url:"ftp"}) }).to.throw();
    });
  });

  describe("check", function() {
    it("makes an http GET request when given an http url", function() {
      monitor = new Monitor({
        url: "http://example.com"
      });
      h.fakeNet(function () {
        monitor.check()
        expect(h.http.get).to.have.been.calledOnce;
        expect(h.https.get).not.to.have.been.calledOnce;
      });
    });

    it("makes an https GET request when given an https url", function() {
      monitor = new Monitor({
        url: "https://example.com"
      });
      h.fakeNet(function () {
        monitor.check()
        expect(h.http.get).not.to.have.been.calledOnce;
        expect(h.https.get).to.have.been.calledOnce;
      });
    });

    it("fail if cannot connect", function () {
    });
  });

  describe("start()", function() {
    it("starts a timer for check() based on the frequency");
    it("calls check() immediately");
  });
});

