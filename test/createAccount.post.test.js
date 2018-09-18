var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../server");
var expect = chai.expect;

// Setting up the chai http plugin
chai.use(chaiHttp);

var request;

describe("POST /api/createAccount", function() {
  // Before each test begins, create a new request server for testing
  beforeEach(function() {
    request = chai.request(server);
  });

  it("Should allow a new user to create an account", function(done) {
    // Create an object to send to the endpoint
    var reqBody = {
      email: "test" + randomString() + "@gmail.com",
      password: "aA!cesof" + randomString()
    };

    // POST the request body to the server
    request
      .post("/api/createAccount")
      .send(reqBody)
      .end(function(err, res) {
        var responseStatus = res.status;

        // Run assertions on the response

        expect(err).to.be.null;

        expect(responseStatus).to.equal(200);

        // The `done` function is used to end any asynchronous tests
        done();
      });
  });

  it("Should not allow an existing user to create an account", function(done) {
    // Create an object to send to the endpoint
    var reqBody = {
      email: "pjdflow@gmail.com",
      password: "helpMe"
    };

    // POST the request body to the server
    request
      .post("/api/createAccount")
      .send(reqBody)
      .end(function(err, res) {
        var responseStatus = res.status;

        // Run assertions on the response

        expect(err).to.be.null;

        expect(responseStatus).to.equal(401);

        // The `done` function is used to end any asynchronous tests
        done();
      });
  });

  it("Should not create an account with invalid email", function(done) {
    // Create an object to send to the endpoint
    var reqBody = {
      email: "a",
      password: "a"
    };

    // POST the request body to the server
    request
      .post("/api/createAccount")
      .send(reqBody)
      .end(function(err, res) {
        var responseStatus = res.status;

        // Run assertions on the response

        expect(err).to.be.null;

        expect(responseStatus).to.equal(401);

        // The `done` function is used to end any asynchronous tests
        done();
      });
  });
});

function randomString() {
  var randomNumbers = "";
  for (var i = 0; i < 10; i++) {
    randomNumbers += Math.round(Math.random() * 10).toString();
  }
  return randomNumbers;
}
