const express = require("express");
const app = express();

// Express needs to be able to understand JSON when we send it in the Payload Body / req.body
app.use(express.json());

// Start the app and append all the methods (GET, POST, DELETE, PUT)
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/", (req, res) => {});

app.put("/", (req, res) => {});

app.delete("/", (req, res) => {});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
