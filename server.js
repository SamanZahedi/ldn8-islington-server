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

const port = process.env.PORT || 9000;
app.listen(port, console.log(`Server is listening on port ${port}...`));

app.get("/", (req, res) => {
  res.status(201).send("Server is ready to use");
});
