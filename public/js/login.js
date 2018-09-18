$(".login-form").on("submit", function(event) {
  event.preventDefault();

  // Grab the email login
  var emailAddr = document.getElementsByName("email")[0].value;
  var passIt = document.getElementsByName("password")[0].value;

  var userdata = {
    email: emailAddr,
    password: passIt
  };

  // Verify the user
  $.post("/api/login", userdata, function(data, status) {
    // User is good - use endpoint to get the nickname
    $.get("/api/nickname/" + emailAddr, function(data) {
      if (data) {
        // Set the authorID
        window.localStorage.setItem("AuthID", data.id);

        // Send to the home page
        window.location.assign("/home");
      }
    });
  }).fail(function(data) {
    console.log("error ", data.responseText);
    alert(data.responseText);
  });
});

$(".create-form").on("submit", function(event) {
  event.preventDefault();

  // Grab the email login
  var emailAddr = document.getElementsByName("email")[0].value;
  var passIt = document.getElementsByName("password")[0].value;
  var nickname = document.getElementsByName("nickname")[0].value;
  var cell = document.getElementsByName("cell")[0].value;

  if (!nickname){
    alert("Please enter a nickname");
    return;
  }

  if (cell) {
    // This is used to validate the phone number is 10-digit number
    var cell = cell.replace(/[^0-9]/g, "");

    if (cell.length !== 10) {
      alert("Invalid phone number");
    }
  }

  var userdata = {
    email: emailAddr,
    password: passIt,
    nickname: nickname,
    cell: cell
  };

  // Create the account
  $.post("/api/createAccount", userdata, function(data, status) {
    // Use endpoint to get the new AuthID
    $.get("/api/nickname/" + emailAddr, function(data) {
      if (data) {
        // Grab it and set it in local storage
        window.localStorage.setItem("AuthID", data.id);
        window.location.assign("/home");
      }
    });
  }).fail(function(data) {
    console.log("error ", data.responseText);
    alert(data.responseText);
  });
});
