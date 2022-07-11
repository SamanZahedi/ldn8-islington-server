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

//Questions
app.get("/questions", (req, res) => {
  pool
    .query(`select * from questions`)
    .then((result) => res.status(200).json(result.rows))
    .catch((error) => res.status(500).json(error));
});

app.get("/questions/:questionId", (req, res) => {
  const id = req.params.questionId;
  pool
    .query(`select * from questions where id = $1`, [id])
    .then((result) => res.status(200).json(result.rows))
    .catch((error) => res.status(500).json(error));
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


app.get("/questions/:questionId/answers", (req, res) => {
  const id = req.params.questionId;
  pool
    .query(`select * from answers where question_id = $1`, [id])
    .then((result) => res.status(200).json(result.rows))
    .catch((error) => res.status(500).json(error));
});

app.post("/questions", (req, res) => {
  const { exam_id, image, question } = req.body;
  pool
    .query(
      `Insert Into questions (exam_id, image, question) 
        Values ($1, $2, $3)`,
      [exam_id, image, question]
    )
    .then(() => res.status(200).send("Question created."))
    .catch((error) => res.status(500).json(error));
});


//Lessons
app.get("/lessons", (req, res) => {
  pool
    .query(`select * from lessons`)
    .then((result) => res.status(200).json(result.rows))
    .catch((error) => res.status(500).json(error));
});

app.get("/lessons/:lessonId", (req, res) => {
  const id = req.params.lessonId;
  pool
    .query(`select * from lessons where id = $1`, [id])
    .then((result) => res.status(200).json(result.rows))
    .catch((error) => res.status(500).json(error));
});

app.post("/lessons", (req, res) => {
  const { title, imgurl, intro, summary, content, url, rating } = req.body;
  pool
    .query(
      `Insert Into lessons (title, imgurl, intro, summary, content, url, rating) 
        Values ($1, $2, $3, $4, $5, $6, $7)`,
      [title, imgurl, intro, summary, content, url, rating]
    )
    .then(() => res.status(200).send("Lesson created."))
    .catch((error) => res.status(500).json(error));
});

app.put("/lessons/:lessonId", (req, res) => {
  const id = req.params.lessonId;
  const { title, imgurl, intro, summary, content, url, rating } = req.body;
  pool
    .query(
      `Update lessons Set title = $1, imgurl= $2, intro= $3, summary = $4, content = $5, url = $6, rating = $7 
        Where id = $8`,
      [title, imgurl, intro, summary, content, url, rating , id]
    )
    .then(() => res.status(200).send("Lesson updated."))
    .catch((error) => res.status(500).json(error));
});

app.delete("/lessons/:lessonId", (req, res) => {
  const id = req.params.lessonId;
  pool
    .query(`select * from lessons where id = $1`, [id])
    .then((result) => {
      if(result.rows.length>0){
        pool
          .query(`Delete from lessons where id = $1`, [id])
          .then(() => res.status(200).send("Lesson deleted."))
          .catch((error) => res.status(500).json(error));
           } else {
             res.status(200).send("Lesson does not exist.")  
           }})
    .catch((error) => res.status(500).json(error));
});

//Answers
app.get("/answers", (req, res) => {
  pool
    .query(`select * from answers`)
    .then((result) => res.status(200).json(result.rows))
    .catch((error) => res.status(500).json(error));
});

app.get("/answers/:answerId", (req, res) => {
  const id = req.params.answerId;
  pool
    .query(`select * from answers where id = $1`, [id])
    .then((result) => res.status(200).json(result.rows))
    .catch((error) => res.status(500).json(error));
});
