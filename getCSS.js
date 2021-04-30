const targetUrl = "https://www.google.com/";
const targetElement = "k1zIA"; //id or classname

////////////////////////////////////////////////

const puppeteer = require("puppeteer");
const fs = require("fs");

////////////////////////////////////////////////

const getTrees = async () => {
  //////// Cache config to make pupppeter faster
  const browser = await puppeteer.launch({
    userDataDir: "./cacheData",
  });

  //////// Alocating the new page
  const page = await browser.newPage();

  //////// Blocking images, videos and font files to make request faster
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (request.resourceType() === "image") {
      request.abort();
    } else if (request.resourceType() === "video") {
      request.abort();
    } else if (request.resourceType() === "font") {
      request.abort();
    } else {
      request.continue();
    }
  });

  //////// Opens targeted url
  await page.goto(targetUrl);

  const elementCSS = await page.evaluate((targetElement) => {

    try {
      //////////// Getting element
      let target;
      if (document.getElementById(targetElement)) {
        target = document.getElementById(targetElement);
      } else {
        target = document.getElementsByClassName(targetElement)[0];
      }

      //////// Saving css computed with classes still active
      const targetCSS = window.getComputedStyle(target);
      let cssOne = {};
      for (let i = 0; i < targetCSS.length; i++) {
        const element = targetCSS[i];
        cssOne = {
          ...cssOne,
          [element]: targetCSS[element]
        };
      }

      //////// Delete all custom css
      document.querySelectorAll('style,link[rel="stylesheet"]').forEach(item => item.remove());

      //////// Saving standard css for comparison
      const targetCSSclean = window.getComputedStyle(target);
      let cssTwo = {};

      //////// Saving differences between versions
      for (let i = 0; i < targetCSSclean.length; i++) {
        const element = targetCSSclean[i];
        if (!(targetCSSclean[element] === cssOne[element]) && !element.includes("webkit")) {
          cssTwo = {
            ...cssTwo,
            [element]: cssOne[element] + "@#$"
          };
        }
      }

      //////// Making output look like a css file
      cssTwo =
        ".customComputedCSS " +
        JSON.stringify(cssTwo)
          .replace(/"|\\/g, " ")
          .replace(/@#\$ ,/g, ";\n")
          .replace("\{", "\{\n")
          .replace("\}", "\n\}")
          .replace("@#$", "");

      //////// returning the file from puppeteer
      return cssTwo;
    } catch (error) {
      return "Error in trying to find the element."
    }

  }, targetElement);

  //////// closes virtual browser
  browser.close();

  //////// Saving CSS
  await fs.writeFile("./computedCSS.css", elementCSS, function (err) {
    if (err) return console.log("Error saving css! ", err);
  });

}

getTrees();

