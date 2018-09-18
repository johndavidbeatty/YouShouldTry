var db = require("../models");
var firebase = require("firebase");
var admin = require("firebase-admin");

// Read and set environment variables
require("dotenv").config();

var twilio_sid = process.env.TWILIO_SID;
var twilio_token = process.env.TWILIO_TOKEN;

const client = require('twilio')(twilio_sid, twilio_token);

// Initialize Firebase
var config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
};

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

firebase.initializeApp(config);

module.exports = function(app) {
  // Get all items
  app.get("/api/items", function(req, res) {
    db.Item.findAll({
      where: {},
      include: [db.Author, db.Category]
    }).then(function(dbItems) {
      res.json(dbItems);
    });
  });

  // Load categories for menus
  app.get("/api/categories", function(req, res) {
    db.Category.findAll({}).then(function(dbCategories) {
      res.json(dbCategories);
    });
  });

  // Create a new item
  app.post("/api/items", function(req, res) {

    var msg = "New recommendation: " + req.body.text + " - https://youshouldtry.herokuapp.com/home";

    // For everyone who has a cell phone, notify them about the new item
    db.Author.findAll({raw : true}).then(function(dbAuthor) {

      for (var i = 0; i < dbAuthor.length; i++) {
        if (dbAuthor[i].cell)
        {
          // Send a text
          client.messages.create({
            body: msg,
            from: '+18582951090',
            to: '+1' + dbAuthor[i].cell
          })
          .then(message => console.log(message.sid))
          .done();
        }
      }
    });

    db.Item.create(req.body).then(function(dbItem) {
      res.json(dbItem);
    });
  });

  // Create a new item
  app.post("/api/category", function(req, res) {
    db.Category.create(req.body).then(function(dbCategory) {
      res.json(dbCategory);
    });
  });

  // Create a review (also called comment)
  app.post("/api/review", function(req, res) {
    db.Review.create(req.body).then(function(dbReview) {
      res.json(dbReview);
    });
  });

  // Delete an item by id
  app.delete("/api/items/:id", function(req, res) {
    db.Item.destroy({ where: { id: req.params.id } }).then(function(dbItem) {
      res.json(dbItem);
    });
  });

  // Perform account creation
  app.post("/api/createAccount", function(req, res) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(req.body.email, req.body.password)
      .then(
        function(success) {
          console.log(success);
          console.log("user created account successfully");

          // Want to stuff email and nickname in author's table here
          db.Author.create({
            name: req.body.nickname,
            email: req.body.email,
            cell: req.body.cell
          }).then(function() {
            // Need to put this back to capture in html processing
            res.json({ success: "Updated Successfully", status: 200 });
          });
        },
        function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var objectToRender = {
            errorMessage: error.message
          };
          // Return error
          console.log(errorCode, objectToRender.errorMessage);
          res.json(401, objectToRender.errorMessage);
        }
      );
  });

  // Perform invite new user by email
  app.post("/api/invite", function(req, res) {
    var uid = "";
    firebase
      .auth()
      .createUserWithEmailAndPassword(req.body.email, "1!dfAcfhe342")
      .then(
        function() {
          firebase
            .auth()
            .sendPasswordResetEmail(req.body.email)
            .then(
              function() {
                admin
                  .auth()
                  .getUserByEmail(req.body.email)
                  .then(function(userRecord) {
                    // See the UserRecord reference doc for the contents of userRecord.
                    uid = userRecord.uid;
                    admin
                      .auth()
                      .deleteUser(uid)
                      .then(
                        function() {
                          res.render("index");
                        },
                        function(error) {
                          res
                            .status(500)
                            .render("invite", { errorMessage: error.message });
                        }
                      );
                  })
                  .catch(function(error) {
                    console.log("Error fetching user data:", error);
                    res
                      .status(500)
                      .render("invite", { errorMessage: error.message });
                  });
              },
              function(error) {
                var objectToRender = {
                  errorMessage: error.message
                };
                // Return error
                res.status(401);
                res.render("invite", objectToRender.errorMessage);
              }
            );
        },
        function(error) {
          var objectToRender = {
            errorMessage: error.message
          };
          // Return error
          res.status(401);
          res.render("invite", objectToRender);
        }
      );
  });

  // Perform login
  app.post("/api/login", function(req, res) {
    firebase
      .auth()
      .signInWithEmailAndPassword(req.body.email, req.body.password)
      .then(
        function(success) {
          console.log(success);
          console.log("user logged in successfully");
          res.json({ success: "Updated Successfully", status: 200 });
        },
        function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var objectToRender = {
            errorMessage: error.message
          };

          // Return error
          console.log(errorCode, objectToRender.errorMessage);
          res.json(401, objectToRender.errorMessage);
        }
      );
  });

  // Get Nickname
  app.get("/api/nickname/:email", function(req, res) {
    db.Author.findOne({
      where: {
        email: req.params.email
      }
    }).then(function(dbAuthor) {
      res.json(dbAuthor);
    });
  });
};
