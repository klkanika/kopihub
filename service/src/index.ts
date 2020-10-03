import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send('Service for batchjob');
})

app.listen(5000, () => {
  console.log(`server started at http://localhost:${5000}`);
});