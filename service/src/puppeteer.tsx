import { resolve } from "path";
import puppeteer from "puppeteer";

(async () => {
  //connect to existing browser
  //NOTE!! need to set your own
  const browser = await puppeteer.connect({
    browserWSEndpoint:
      "ws://127.0.0.1:9222/devtools/browser/5891705b-d835-45c2-af29-88c48f782b93",
  });

  const page = await browser.newPage();
  await page.setRequestInterception(true);
  const url = "https://manager.ocha.in.th/";

  const cookie = await getCookie(page);
  //got cookie
  console.log("cookie:", cookie);

  page.on("request", async (request) => {
    if (request.url() === "https://live.ocha.in.th/api/transaction/last/") {
      if (request.headers()["authorization"]) {
        //got headers
        console.log("headers:", request.headers()["authorization"]);
      }
    }
    request.continue();
  });

  await page.goto(url);
})();

const getCookie = async (page) =>
  (
    await page.cookies(
      "https://live.ocha.in.th/api/report/v2https://live.ocha.in.th/api/transaction/last/"
    )
  )
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
