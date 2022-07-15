const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
// var http = require("http");
// var enforce = require("express-sslify");

const app = express();
// app.use(enforce.HTTPS({ trustProtoHeader: true }));


app.use(express.json());
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const port = process.env.PORT || 7007;
app.listen(port, console.log(`Server is listening on port ${port}...`));
// http.createServer(app).listen(app.get(port), function () {
//   console.log("Express server listening on port " + app.get(port));
// });


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


// app.get("/questions/difficulty/:difficulty_type", (req, res) => {
//   const difficulty = req.params.difficulty_type;

//   pool
//     .query(
//       `
// select questions.id, question, difficulty, answers.id as answer_id, answer, is_correct
// From questions
// Inner join answers on question_id = questions.id
//   inner join exams on exams.id = exam_id
// Inner join difficulty on difficulty.id = difficulty_id
// Where difficulty_id = $1`,
//       [difficulty]
//     )
//     .then((result) => {
//       const arr = [];
//       let obj = {};
//       let q_id_old = 0;
//       result.rows.map((el) => {
//         if (el.id != q_id_old) {
//           q_id_old = el.id;
//           // console.log(obj);
//           if (Object.keys(obj).length !== 0) {
//             arr.push(obj);
//           }
//           obj = {
//             id: el.id,
//             question: el.question,
//           };
//           obj["answers"] = [];
//           obj.answers.push({
//             id: el.answer_id,
//             answer: el.answer,
//             is_correct: el.is_correct,
//           });
//         } else {
//           obj.answers.push({
//             id: el.answer_id,
//             answer: el.answer,
//             is_correct: el.is_correct,
//           });
//         }
//       });
//       arr.push(obj);
//       res.json(arr);
//     });
// });

// Questions combined with answers for different lessonId
app.get("/questions/lessons/:lessonId", (req, res) => {
  const lessonId = req.params.lessonId;

  pool
    .query(
      `
select questions.id, image, question,  answers.id as answer_id, answer, is_correct, lesson_id
From questions
Inner join answers on question_id = questions.id
Where lesson_id = $1`,
      [id]
    )
    .then((result) => {
      const arr = [];
      let obj = {};
      let q_id_old = 0;
      result.rows.map((el) => {
        if (el.id != q_id_old) {
          q_id_old = el.id;
          // console.log(obj);
          if (Object.keys(obj).length !== 0) {
            arr.push(obj);
          }
          obj = {
            id: el.id,
            question: el.question,
            image: el.image,
          };
          obj["answers"] = [];
          obj.answers.push({
            id: el.answer_id,
            answer: el.answer,
            is_correct: el.is_correct,
          });
        } else {
          obj.answers.push({
            id: el.answer_id,
            answer: el.answer,
            is_correct: el.is_correct,
          });
        }
      });
      arr.push(obj);
      // console.log(arr);
      res.json(arr);
    });
});


app.get("/questions/:questionId/answers", (req, res) => {
  const id = req.params.questionId;
  pool
    .query(`select * from answers where question_id = $1`, [id])
    .then((result) => res.status(200).json(result.rows))
    .catch((error) => res.status(500).json(error));
});

app.post("/questions", (req, res) => {
  const { lesson_id, image, question } = req.body;
  pool
    .query(
      `Insert Into questions (lesson_id, image, question) 
        Values ($1, $2, $3)`,
      [lesson_id, image, question]
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
