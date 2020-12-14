import puppeteer from "puppeteer";
const { query } = require("./utils/database");

(async () => {
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
  const browser = await puppeteer.connect({
    browserWSEndpoint:
      "ws://127.0.0.1:9222/devtools/browser/50d1f9c4-e11f-4207-adc1-2346d2728808",
  });

  const page = await browser.newPage();
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
      }
    }
    request.continue();
  });

  await page.goto(url);

  //refresh every 12 hours
  const delay = 12 * 60 * 60 * 1000;
  const interval = () => {
    setTimeout(async () => {
      await page.reload();
      interval();
    }, delay);
  };

  interval();
})();

const getCookie = async (page) =>
  (
    await page.cookies(
      "https://live.ocha.in.th/api/report/v2https://live.ocha.in.th/api/transaction/last/"
    )
  )
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
