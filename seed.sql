DROP DATABASE IF EXISTS item_db;
CREATE DATABASE item_db;
USE item_db;

INSERT INTO Authors (name, email, createdAT, updatedAT)
VALUES ("Cooper","cooper@jbeatty.com", "2018-08-27 23:46:51", "2018-08-27 23:46:51");
INSERT INTO Authors (name, email, cell, createdAT, updatedAT)
VALUES ("Jamie","jamie@jbeatty.com", "8583952704", "2018-08-27 23:46:51", "2018-08-27 23:46:51");
INSERT INTO Authors (name, email, createdAT, updatedAT)
VALUES ("Annette","test@test.com","2018-08-27 23:46:51", "2018-08-27 23:46:51");
INSERT INTO Authors (name, email, createdAT, updatedAT)
VALUES ("Fred","freddy@jbeatty.com", "2018-08-27 23:46:51", "2018-08-27 23:46:51");
INSERT INTO Authors (name, email, createdAT, updatedAT)
VALUES ("AnotherFred","freddy1@jbeatty.com","2018-08-27 23:46:51", "2018-08-27 23:46:51");
INSERT INTO Authors (name, email, createdAT, updatedAT)
VALUES ("Philip","test@test.com","2018-08-27 23:46:51", "2018-08-27 23:46:51");

INSERT INTO Categories (name,  createdAT, updatedAT)
VALUES ("Pizza","2018-08-27 23:46:51", "2018-08-27 23:46:51");
INSERT INTO Categories (name,  createdAT, updatedAT)
VALUES ("Breakfast","2018-08-27 23:46:51", "2018-08-27 23:46:51");
INSERT INTO Categories (name,  createdAT, updatedAT)
VALUES ("Lunch","2018-08-27 23:46:51", "2018-08-27 23:46:51");

INSERT INTO Items (text, note, googleMap, yelpURL, createdAT, updatedAT,AuthorId,CategoryId)
VALUES ("Bronx Pizza, Washington Street, San Diego, CA, USA","Try the 2 cheese and a drink","https://www.google.com/maps/search/?api=1&query=bronx+pizza%2C+washington+street%2C+san+diego%2C+ca","https://www.yelp.com/biz/bronx-pizza-san-diego","2018-08-27 23:46:51", "2018-08-27 23:46:51",1,1);

INSERT INTO Items (text, note, googleMap, yelpURL, createdAT, updatedAT,AuthorId,CategoryId)
VALUES ("Breakfast Republic, University Avenue, San Diego, CA, USA","Get there before 8:15am or crowded","https://www.google.com/maps/search/?api=1&query=Breakfast+Republic%2C+University+Avenue%2C+San+Diego%2C+CA%2C+USA","https://www.yelp.com/biz/breakfast-republic-san-diego?osq=Breakfast+Republic","2018-08-27 23:46:51", "2018-08-27 23:46:51",2,2);

INSERT INTO Reviews (comment, createdAT, updatedAT,ItemId, AuthorId)
VALUES ("I really want to try this","2018-08-27 23:46:51", "2018-08-27 23:46:51",1,3);
INSERT INTO Reviews (comment, createdAT, updatedAT,ItemId, AuthorId)
VALUES ("Try the french toast","2018-08-27 23:46:51", "2018-08-27 23:46:51",2,4);



