// this one shows off built-in raven support
module.exports = {
  "example check": {
    url: "http://localhost:3000",
    frequency: 2000, // how often to make a request (optional, defaults to 5 minutes)
    expectStatusCode: 200, // http status code (optional, defaults to 200)
    expectMatchBody: /ok/, // (optional, doesn't check body by default)
  },
  my_other_app: {
    // and so on ...
  }
};
