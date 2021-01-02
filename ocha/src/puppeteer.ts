import puppeteer from "puppeteer";
import fs from "fs";
import { Storage } from "@google-cloud/storage";
const { query } = require("./utils/database");
const archiver = require("archiver");
const unzip = require("unzipper");
const rimraf = require("rimraf");

let started = false;
const getCookie = async (page) =>
  (
    await page.cookies(
      "https://live.ocha.in.th/api/report/v2https://live.ocha.in.th/api/transaction/last/"
    )
  )
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

const storage = new Storage({
  keyFilename: "./src/cred.json",
});

const zipDirectory = (source, out) => {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on("error", (err) => reject(err))
      .pipe(stream);

    stream.on("close", () => resolve(null));
    archive.finalize();
  });
};
let uploading = false;
const uploadBrowserState = async () => {
  if (uploading) {
    return;
  }
  try {
    uploading = true;
    console.log("uploadBrowserState");
    //Zip and upload
    rimraf.sync("./src/userData.zip");
    await zipDirectory("./src/userData", "./src/userData.zip");
    await storage.bucket("kopihub").upload("./src/userData.zip", {
      destination: "userDataXXX.zip",
    });
    console.log("done upload file");
  } catch (ex) {
    console.log(ex);
  }
  uploading = false;
};

let downloaded = false;
const downloadBrowserState = async () => {
  if (!downloaded) {
    return;
  }
  console.group("downloadBrowserState");
  rimraf.sync("./src/userDataOutPut.zip");
  rimraf.sync("./src/userData");

  //Download
  //Unzip
  await storage
    .bucket("kopihub")
    .file("userDataXXX.zip")
    .download({
      destination: "./src/userDataOutPut.zip",
    })
    .then(() => {});
  fs.createReadStream("./src/userDataOutPut.zip").pipe(
    unzip.Extract({ path: "./src/userData" })
  );
  downloaded = true;
};
let page;
let reloadReady = false;
export const pptr = async () => {
  return new Promise(async (resolve) => {
    started = true;
    await downloadBrowserState();
    /*
    PULL
  */

    const { rows } = await query("select id from auth");
    if (rows.length === 0)
      await query("insert into auth values ($1, $2, $3, $4)", [
        1,
        "",
        "",
        new Date(),
      ]);
    const id = rows[0]?.id || 1;
    console.log("rows id:", id);

    //connect to existing browser
    //NOTE!! need to set your own
    let browser = await puppeteer.launch({
      userDataDir: "./src/userData",
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-setuid-sandbox",
      ],
    });
    page = await browser.newPage();
    await page.setRequestInterception(true);
    const url = "https://manager.ocha.in.th/";

    page.on("request", async (request) => {
      if (request.url() === "https://live.ocha.in.th/api/transaction/last/") {
        if (request.headers()["authorization"]) {
          //save cookie to db
          const cookie = await getCookie(page);
          await query(
            "update auth set cookie = $1, last_update = $2 where id = $3",
            [cookie, new Date(), id]
          );
          console.log("saved cookie", cookie);

          //save token to db
          const token = request.headers()["authorization"];
          await query(
            "update auth set token = $1, last_update = $2 where id = $3",
            [token, new Date(), id]
          );
          console.log("saved token", token);
          reloadReady = true;
          await uploadBrowserState();
          resolve(null);
        }
      }
      request.continue();
    });

    await page.goto(url, { waitUntil: "networkidle2" });
  });
};
