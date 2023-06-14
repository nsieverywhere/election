const express = require("express");
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

const db = new sqlite3.Database('DB/data.sqlite');

// Perform a SELECT query
db.all('SELECT * FROM agentname', (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      // Process the query result
      rows.forEach((row) => {
        console.log(row);
      });
    }
  
    // Close the database connection
    db.close();
  });





// create get routes
app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/lga", async (req, res) => {
  res.render("lga");
});

app.get("/newunit", async (req, res) => {
    res.render("newunit");
  });


app.get("*", (req, res) => {
  res.status(404).render("404");
});

app.use((req, res, next) => {
  res.status(404).render("404"); // Assuming you have a '404' view template
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("server started!");
});
