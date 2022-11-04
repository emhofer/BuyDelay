const express = require("express");
const app = express();
const port = 3001;
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/api", (req, res) => {
  let db = new sqlite3.Database("./db/data.db");
  const sql = "SELECT * FROM items";
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json({ message: "success", data: rows });
  });
  db.close();
});

app.post("/addProduct", (req, res) => {
  const { name, delay, user_id } = req.body;
  const sql =
    "INSERT INTO items (name, delay, date, user_id) VALUES (?, ?, ?, ?)";
  const params = [name, delay, new Date(), user_id];
  let db = new sqlite3.Database("./db/data.db");
  db.run(sql, params, function (err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with row id ${this.lastID}`);
  });
  db.close();
});

app.post("/removeProduct", (req, res) => {
  const { id } = req.body;
  const sql = "DELETE FROM items WHERE id = ?";
  const params = [id];
  let db = new sqlite3.Database("./db/data.db");
  db.run(sql, params, function (err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been deleted with row id ${id}`);
  });
  db.close();
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
