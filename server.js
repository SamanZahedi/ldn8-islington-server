const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(express.json());
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const port = process.env.PORT || 9001;
app.listen(port, console.log(`Server is listening on port ${port}...`));

app.get("/", (req, res) => {
  res.status(201).send("Server is ready to use");
});

app.get("/questions", (req, res) => {
  pool
    .query(
      `select * from questions`
    )
    .then((result) => res.json(result.rows))
    .catch((error) => res.json(error));
});

app.get("/answers", (req, res) => {
  pool
    .query(`select * from answers`)
    .then((result) => res.json(result.rows))
    .catch((error) => res.json(error));
});
