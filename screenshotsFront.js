const targetUrl = "https://brunobarros.dev";

//// desktop version, but you can choose as you please
const resollutions = [
  "2560x1080",
  "3840x2160",
  "1920x1080",
  "1366x768",
  "1536x864",
  "1440x900",
  "1280x720",
  "1600x900",
  "360x640",
  "414x896",
  "360x780",
  "375x667",
  "360x800",
  "360x760",
]

//// formats resolutions for better use

const allResolutions = resollutions.map((item) => {
  const output = item.split("x");
  return {
    width: +output[0],
    height: +output[1]
  }
})

////////////////////////////////////////////////

const puppeteer = require("puppeteer");

////////////////////////////////////////////////

const getSizes = async () => {
  //////// Cache config to make pupppeter faster
  const browser = await puppeteer.launch({
    userDataDir: "./cacheData",
  });

  //////// Alocating the new page  

  ////////

  let pages = await {};

  for (let i = 0; i < allResolutions.length; i++) {
    const session = allResolutions[i];
    page = await browser.newPage();
    pages = await {...pages, [i]: page};
    await pages[i].setViewport({ width: session.width, height: session.height });
    await pages[i].goto(targetUrl);
    await pages[i].screenshot({ path: `shot${session.width}x${session.height}.png` });
  }

  await browser.close();

  //////// Ends
  console.log("Done!");
}

getSizes();

