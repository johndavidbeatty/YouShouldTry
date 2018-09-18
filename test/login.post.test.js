var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../server");
var expect = chai.expect;

// Setting up the chai http plugin
chai.use(chaiHttp);

var request;

describe("POST /api/login", function() {
  // Before each test begins, create a new request server for testing
  beforeEach(function() {
    request = chai.request(server);
  });

  it("Should allow a user to login", function(done) {
    // Create an object to send to the endpoint
    var reqBody = {
      email: "pjdflow@gmail.com",
      password: "helpMe"
    };

    // POST the request body to the server
    request
      .post("/api/login")
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

  it("Should not pass invalid login credentials", function(done) {
    // Create an object to send to the endpoint
    var reqBody = {
      email: "a",
      password: "a"
    };

    // POST the request body to the server
    request
      .post("/api/login")
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
