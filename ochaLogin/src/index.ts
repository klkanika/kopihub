const puppeteer = require('puppeteer');
const request_client = require('request-promise-native');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // request OTP's process
  await page.goto('https://manager.ocha.in.th/login'); 
  await page.type('#mobile_number', 'dream');
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
  ]);
  console.log('New Page URL:', page.url());

  const result : any = []

  await page.setRequestInterception(true);

  await page.on('request', (request : any) => {
    const request_url = request.url();
    const request_headers = request.headers();
    const request_post_data = request.postData();

    const response = request.response();
    console.log('request_url', request_url)
    console.log('request_headers', request_headers)
    console.log('request_post_data', request_post_data)
    console.log('response', response)
    request.continue();
  });

  await Promise.all([
    page.click('#CASHIER'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
  ]);
  console.log('New Page URL:', page.url());

  await browser.close();
})();

function waitGetOTP(milliseconds : number) {
  const date = Date.now();
  let currentDate = null;
  let otp = null;
  
  do {
    currentDate = Date.now();
    //query for getting OTP
  } while (!otp && currentDate - date < milliseconds);
}

