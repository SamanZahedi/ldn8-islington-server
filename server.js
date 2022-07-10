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

app.get("/lessons", (req, res) => {
  pool
    .query(`select * from lessons`)
    .then((result) => res.json(result.rows))
    .catch((error) => res.json(error));
});


app.get("/questions/difficulty/:difficulty_type", (req, res) => {
  const difficulty = req.params.difficulty_type;
  console.log(difficulty);
  pool
    .query(
      `select questions.*, difficulty.type as diff_type 
      from questions 
      inner join exams on exams.id = exam_id 
      inner join difficulty on difficulty.id = difficulty_id
      where difficulty_id = $1`,
      [difficulty]
    )
    .then((result) => {
      console.table("table:", result.rows);
      res.json(result.rows);
    })
    .catch((error) => res.json(error));
});

app.get("/answers", (req, res) => {
  pool
    .query(`select * from answers`)
    .then((result) => res.json(result.rows))
    .catch((error) => res.json(error));
});


