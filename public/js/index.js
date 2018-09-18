// Get references to page elements
var $itemText = $("#item-text");
var $itemNote = $("#item-note");
var $itemCat = $("#category");
var $submitBtn = $("#submit");
var $catSubBtn = $("#catsubmit");
var $newCat = $("#new-cat");
var $itemList = $("#item-list");
var authId = window.localStorage.getItem("AuthID");

// The API object contains methods for each kind of request we'll make
var API = {
  saveItem: function(item) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/api/items",
      data: JSON.stringify(item)
    });
  },
  saveReview: function(review) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/api/review",
      data: JSON.stringify(review)
    });
  },
  saveCategory: function(newCat) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/api/category",
      data: JSON.stringify(newCat)
    });
  },
  getItems: function() {
    return $.ajax({
      url: "api/items",
      type: "GET"
    });
  },
  deleteItem: function(id) {
    return $.ajax({
      url: "api/items/" + id,
      type: "DELETE"
    });
  }
};

// handleFormSubmit is called whenever we submit a new item
// Save the new item to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var error = false;
  var errorStr = "You must enter ";

  if (!$itemText.val()) {
    errorStr += "Recommendation";
    error = true;
  }

  if (!$itemNote.val()) {
    if (error) {
      errorStr += ", ";
    }
    errorStr += "Notes";
    error = true;
  }

  if (!$itemCat.val()) {
    if (error) {
      errorStr += ", ";
    }
    errorStr += "Category";
    error = true;
  }

  if (error) {
    alert(errorStr);
    return;
  }

  var item = {
    text: $itemText.val().trim(),
    note: $itemNote.val().trim(),
    googleMap: "",
    yelpURL: "",
    AuthorId: authId,
    CategoryId: $itemCat.val()
  };
  console.log(item);

  // Now find the yelp data
  var str = $itemText.val().trim();
  var splitArray = str.split(",");
  var Name = encodeURIComponent(splitArray[0]);
  var Street = encodeURIComponent(splitArray[1]);
  var City = encodeURIComponent(splitArray[2]);
  var State = splitArray[3];

  var term = "name=" + Name;

  var url =
    "https://api.yelp.com/v3/businesses/matches?" +
    term +
    "&address1=" +
    Street +
    "&city=" +
    City +
    "&state=" +
    State +
    "&country=US";

  item.googleMap =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(str);

  $.ajaxPrefilter(function(options) {
    if (options.crossDomain && $.support.cors) {
      options.url = "https://cors-anywhere.herokuapp.com/" + options.url;
    }
  });

  $.ajax(url, {
    headers: {
      Authorization:
        "Bearer IOnOmcVyQA7g8bfItyRwB1JFyfXeJh0kXRqdwyKUjuxOP2LmvLLth68IN84LwKiAUSgtQN5Bikqdnm70id-_Sj_0U5vTewXNl7ycBkUayA45WB-ozhQ2VEq7-6AuW3Yx"
    }
  }).then(function(response) {
    console.log("Yelp response", response);
    console.log("Yelp array", response.businesses.length);

    if (response.businesses.length > 0) {
      // Got the yelp ID, now get the yelp rich data
      url = "https://api.yelp.com/v3/businesses/" + response.businesses[0].id;

      console.log("getYelpData: URL for Yelp ", url);
      $.ajax(url, {
        headers: {
          Authorization:
            "Bearer IOnOmcVyQA7g8bfItyRwB1JFyfXeJh0kXRqdwyKUjuxOP2LmvLLth68IN84LwKiAUSgtQN5Bikqdnm70id-_Sj_0U5vTewXNl7ycBkUayA45WB-ozhQ2VEq7-6AuW3Yx"
        }
      })
        // $.ajax(url, { headers: { Authorization: 'Bearer s8fyDTIEAcaKIhVHE-YXji0_G6gyCKWLxbwwL5Hg1PQW-Eu_ErKZ-xeV0_xRqQ0VtEV7XpS540SpNB9q4aQkcW-fp43IhgOgfh0fHP_d8YdNVHCqqxgMCBDQ8_U6W3Yx' } })
        .then(function(response) {
          console.log("GetYelpData: Yelp ID search response ", response);

          // Ok, at this point we have all the data we need
          console.log("Yelp business URL: ", response.url);

          // If we have Yelp data, stuff data Yelp URL into object
          item.yelpURL = response.url;

          console.log("Item object: ", item);

          API.saveItem(item).then(function() {
            window.location.assign("/home");
          });
        });
    } else {
      // No yelp data, so stuff data without it
      API.saveItem(item).then(function() {
        window.location.assign("/home");
      });
    }
  });

  $itemText.val("");
  $itemNote.val("");
};

var newReviewSubmit = function(event) {
  event.preventDefault();
  var id = $(this).data("id");
  var comment = $("#comment" + id)
    .val()
    .trim();

  if (!comment) {
    alert("Comment cannot be blank.");
    return;
  }

  var review = {
    comment: comment,
    AuthorId: authId,
    ItemId: id
  };

  API.saveReview(review).then(function() {
    window.location.reload("true");
  });
};

var newCatSubmit = function(event) {
  event.preventDefault();
  if (!$newCat.val()) {
    alert("please enter a category name");
    return;
  }
  var newCat = {
    name: $newCat.val().trim()
  };
  console.log("category: ", newCat);
  API.saveCategory(newCat).then(function() {
    window.location.assign("/newitem");
  });
};

// handleDeleteBtnClick is called when an item's delete button is clicked
// Remove the item from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteItem(idToDelete).then(function() {
    window.location.assign("/home");
  });
};

//
// Add autocomplete functionality to recommendation
autocomplete = new google.maps.places.Autocomplete(
  document.getElementById("item-text")
);

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$itemList.on("click", ".delete", handleDeleteBtnClick);
$(".revsub").on("click", newReviewSubmit);
$catSubBtn.on("click", newCatSubmit);
