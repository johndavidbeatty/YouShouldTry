var db = require("../models");

module.exports = function(app) {
  // Load login page
  app.get("/", function(req, res) {
    res.render("login", {
      errorMessage: ""
    });
  });

  app.get("/createAccount", function(req, res) {
    res.render("createAccount", {
      errorMessage: ""
    });
  });

  // The create account with email optional is used in the email invite system
  app.get("/createAccount/:email", function(req, res) {
    res.render("createAccount", {
      errorMessage: "",
      email: req.params.email
    });
  });

  // Page to invite a new user
  app.get("/invite", function(req, res) {
    res.render("invite");
  });

  // Start with a list of possible categories for the category dropdown and then
  // provides list of recommendations with notes, authors and reviews
  // includes join of Author and Category as well as nested join with reviews and authors
  app.get("/home", function(req, res) {
    Promise.all([
      db.Category.findAll({}),
      db.Item.findAll({
        include: [
          db.Author,
          db.Category,
          {
            model: db.Review,
            include: [db.Author]
          }
        ]
      })
    ]).then(function(dbItems) {
      res.render("index", {
        cats: dbItems[0],
        items: dbItems[1]
      });
    });
  });
  // List of recommendations(Items) by category
  app.get("/home/:catId", function(req, res) {
    Promise.all([
      db.Category.findAll({}),
      db.Item.findAll({
        where: { CategoryId: req.params.catId },
        include: [
          db.Author,
          db.Category,
          {
            model: db.Review,
            include: [db.Author]
          }
        ]
      })
    ]).then(function(dbItems) {
      res.render("index", {
        cats: dbItems[0],
        items: dbItems[1],
        msg: dbItems[1][0].Category.name
      });
    });
  });

  app.get("/newitem", function(req, res) {
    db.Category.findAll({}).then(function(dbCategories) {
      res.render("newitem", {
        cats: dbCategories
      });
    });
  });
  app.get("/newcategory", function(req, res) {
    db.Category.findAll({}).then(function(dbCategories) {
      res.render("newcat", {
        cats: dbCategories
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
