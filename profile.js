//Shira Saban Bitton - 316511658
//Fida Rabah - 204647911
//12/3/24
//The file is a Node.js script that creates a web server using the Express.js framework.
//It sets up routes to handle incoming HTTP requests, reads data from mysql server, and renders dynamic content to be displayed on web pages.

// This line imports the Express.js framework.
//Express is a web application framework for Node.js that simplifies the process of building web applications and APIs by providing a robust set of features for handling HTTP requests, routing, middleware, and more.
const express = require("express");
//This line creates an instance of the Express application by calling the express() function.
//This instance represents your web application and allows you to define routes, middleware, and other configurations.
const app = express();
const port = 3000;
//mysql DB connection library
const mysql = require("mysql2");

//DB constants
const URL = "localhost";
const PORT = 3306;
const USERNAME = "root";
const PASSWORD = "";
const DATABASE = "profiles";

//create conntecion to the db
const connection = mysql.createConnection({
  host: URL,
  port: PORT,
  user: USERNAME,
  password: PASSWORD,
  database: DATABASE,
});

app.set("view engine", "ejs");
app.use(express.static("public"));

//Listen on profile route and read the profile data accurding to the id that we get from the web
app.get("/profile", (req, res) => {
  let id = req.query.id;
  //Query profile text by id
  connection.query(
    "SELECT * FROM text WHERE profile = ?",
    [id],
    (errors, texts) => {
      const profileData = texts;
      //Query profile title by id
      connection.query(
        "SELECT * FROM title WHERE profile = ?",
        [id],
        (errors, title) => {
          //Query profiles names
          connection.query(
            "SELECT profile FROM title",
            (errors, profilesNames) => {
              res.render("profile.ejs", {
                id,
                descText: title[0].long_text,
                titleText: title[0].title,
                htmlBioContent: [], // not is the DB
                contentFiles: profileData.map((item) => item.long_text),
                profilesNames: profilesNames.map((item) => item.profile),
              });
            }
          );
        }
      );
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
