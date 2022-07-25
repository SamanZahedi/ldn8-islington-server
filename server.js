const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(express.json());
app.use(cors());
// console.log("inf",process.env.ENV);
// if (process.env.ENV == "HeroKu") {
//   app.use(express_enforces_ssl());
// }

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const port = process.env.PORT || 9003;
app.listen(port, console.log(`Server is listening on port ${port}...`));

app.get("/", (req, res) => {
  res.status(201).send("Server is ready to use");
});

//Questions
// Questions combined with answers for different lessonId
app.get("/questions/lessons/:lessonId", (req, res) => {
  const lessonId = req.params.lessonId;

  pool
    .query(
      `
select questions.id, image, question
From questions
Where lesson_id = $1`,
      [lessonId]
    )
    .then(async (result) => {
      const arr = [];

      for (question of result.rows) {
        console.log("id", question.id);
        const asnwerResults = await pool.query(
          `select id, is_correct, answer from answers where question_id = $1`,
          [question.id]
        );
        question["answers"] = asnwerResults.rows;
        arr.push(question);
      }
      res.json(arr);
    });
});

//Lessons
app.get("/lessons", (req, res) => {
  pool
    .query(`select * from lessons order by id`)
    .then((result) => res.status(200).json(result.rows))
    .catch((error) => res.status(500).json(error));
});

app.post("/lessons", (req, res) => {
  const { title, img_url, intro, summary, content, video_url } = req.body;
  pool
    .query(
      `Insert Into lessons (title, img_url, intro, summary, content, video_url) 
        Values ($1, $2, $3, $4, $5, $6)`,
      [title, img_url, intro, summary, content, video_url]
    )
    .then(() => res.status(200).send("Lesson created."))
    .catch((error) => res.status(500).json(error));
});

app.put("/lessons/:lessonId", (req, res) => {
  const id = req.params.lessonId;
  const { title, img_url, intro, summary, content, video_url } = req.body;
  pool
    .query(
      `Update lessons Set title = $1, img_url= $2, intro= $3, summary = $4, content = $5, video_url = $6
        Where id = $7`,
      [title, img_url, intro, summary, content, video_url, id]
    )
    .then(() => res.status(200).send("Lesson updated."))
    .catch((error) => res.status(500).json(error));
});

app.delete("/lessons/:lessonId", (req, res) => {
  const id = req.params.lessonId;
  pool
    .query(`select * from lessons where id = $1`, [id])
    .then((result) => {
      if (result.rows.length > 0) {
        pool
          .query(`Delete from lessons where id = $1`, [id])
          .then(() => res.status(200).send("Lesson deleted."))
          .catch((error) => res.status(500).json(error));
      } else {
        res.status(200).send("Lesson does not exist.");
      }
    })
    .catch((error) => res.status(500).json(error));
});

//Answers
// Question and asnwers all in one
app.post("/questions", (req, res) => {
  const { lesson_id, image, question } = req.body;
  const params = [lesson_id, image, question];
  req.body.answers.map((answer) => {
    params.push(answer.answer);
    params.push(answer.is_correct);
  });
  // console.log(params);
  pool
    .query(
      `with q as (Insert Into questions (lesson_id, image, question) 
		Values ($1, $2, $3) returning *),
		answer1 as ( Insert Into answers (answer, is_correct,question_id) 
			Values ($4, $5,(select id from q)), ($6, $7,(select id from q)) ,($8, $9,(select id from q)) ,($10, $11,(select id from q)) returning *)
select * from q`,
      params
    )
    .then(() => res.status(200).send("Question and asnwers created."))
    .catch((error) => res.status(500).json(error));
});

// delete questions and answers
app.delete("/questions/:questionId", function (req, res) {
  const questionId = req.params.questionId;

  pool
    .query("DELETE FROM answers WHERE question_id=$1", [questionId])
    .then(() => pool.query("DELETE FROM questions WHERE id=$1", [questionId]))
    .then(() => res.send(`question ${questionId} deleted!`))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

app.put("/questions", function (req, res) {
  let { lesson_id, image, question, id } = req.body;
  let param = [lesson_id, question, image, id];
  const params = [];
  req.body.answers.map((a, index) => {
    params[index] = [a.answer, a.is_correct, a.id];
  });
  pool
    .query(
      "Update questions Set lesson_id = $1, question = $2, image = $3 Where id = $4",
      param
    )
    .then(() =>
      pool.query(
        "Update answers set answer = $1, is_correct = $2 Where id = $3",
        params[0]
      )
    )
    .then(() =>
      pool.query(
        "Update answers set answer = $1, is_correct = $2 Where id = $3",
        params[1]
      )
    )
    .then(() =>
      pool.query(
        "Update answers set answer = $1, is_correct = $2 Where id = $3",
        params[2]
      )
    )
    .then(() =>
      pool.query(
        "Update answers set answer = $1, is_correct = $2 Where id = $3",
        params[3]
      )
    )
    .then(() => res.send(`question and answers updated!`))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});


app.get("/lessons/:lessonId", (req, res) => {
  const id = req.params.lessonId;
  pool
    .query(`select * from lessons where id = $1`, [id])
    .then((result) => res.status(200).json(result.rows))
    .catch((error) => res.status(500).json(error));
});