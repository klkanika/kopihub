require("dotenv").config();
import express from "express";
import { pptr } from "./puppeteer";

const app = express();

app.post("/start-pptr", async (req, res) => {
  await pptr();
  res.send("ok");
});
app.listen(8080, async () => {
  return;
});
