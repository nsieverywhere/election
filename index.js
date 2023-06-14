const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const multer = require("multer");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up Multer for form data parsing
const upload = multer();

const db = new sqlite3.Database("DB/data.sqlite");

// Perform a SELECT query
// db.all('SELECT * FROM agentname', (err, rows) => {
//     if (err) {
//       console.error(err.message);
//     } else {
//       // Process the query result
//       rows.forEach((row) => {
//         // console.log(row);
//       });
//     }

//   });

// create get routes
app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/lga", async (req, res) => {
  db.all(`SELECT lga_name, lga_id FROM lga`, (err, rows) => {
    // console.log(rows)
    res.render("lga", { lga: rows });
  });
});

app.get("/newunit", async (req, res) => {
  res.render("newunit");
});

// post request

app.post("/pollingunit", async (req, res) => {
  const { pollingUnitId } = req.body;

  db.all(
    `SELECT * FROM announced_pu_results WHERE polling_unit_uniqueid = ?`,
    pollingUnitId,
    (err, rows) => {
      console.log(rows);
      res.render("pollingunit", { units: rows });
    }
  );
});

app.post("/lga", upload.none(), async (req, res) => {
  const lgaId = req.body.lga_id;

  // db.all(`SELECT lga_name, lga_id FROM lga`, (err, rows) => {
  //   console.log(rows)
  //   // res.render("lga", { lga: rows });
  // });

  db.all(`SELECT * FROM polling_unit WHERE lga_id = ?`, lgaId, (err, rows) => {
    if (err) {
      res.status(500).send("An error occurred");
    } else {

      db.all(`SELECT lga_name FROM lga WHERE lga_id = ?`, lgaId, (err, lgarows) => {
        console.log(lgarows)
        res.json({rows: rows, lganame: lgarows, rowCount: rows.length });

      });

    }
  });
});

app.post("/newunit", async (req, res) => {
  const { lga_id } = req.body;
  console.log(lga_id);
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
