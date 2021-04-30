const targetUrl = "https://www.google.com";
const targetElement = null; //[ids classnames] or null/undefined to get everything

//// desktop version, but you can choose as you please
const viewWidth = 1366;
const viewHeight = 768;

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

  //////// sets viewport
  await page.setViewport({ width: viewWidth, height: viewHeight });

  //////// Opens targeted url
  await page.goto(targetUrl);

  console.log("Virtual browser started. Wait!");
  const extractingElements = await page.evaluate((targetElement) => {
    ///////////////////////////////////////////////////// First we get all the elements

    //////////// Getting element
    let allElements = [];
    let allClasses = [];
    let withCss = [];
    const d = document;

    try {
      if (!targetElement) {
        const tempElements = d.body.getElementsByTagName("*");
        ///starts for i : 001
        for (let i = 0; i < tempElements.length; i++) {
          const tempEl = tempElements[i];
          const isValid = !(tempEl.tagName === "NOSCRIPT" || tempEl.tagName === "SCRIPT" || tempEl.tagName === "NEXT-ROUTE-ANNOUNCER" || tempEl.tagName === "STYLE");
          if (isValid)
            allElements.push(tempEl);
        }
        ///ends for i : 001
      } else {
        ///starts for i : 002
        for (let i = 0; i < targetElement.length; i++) {
          const searchInput = targetElement[i];
          const tempElements = d.querySelectorAll(searchInput);
          for (let j = 0; j < tempElements.length; j++) {
            const tempEl = tempElements[j];
            const isValid = !(tempEl.tagName === "NOSCRIPT" || tempEl.tagName === "SCRIPT" || tempEl.tagName === "NEXT-ROUTE-ANNOUNCER" || tempEl.tagName === "STYLE");
            if (isValid)
              allElements.push(tempEl);
          }
        }
        ///ends for i : 002
      }
    } catch (error) {
      return "Error in trying to find all elements."
    }

    ///////////////////////////////////////////////////// Now we are going to extract custom css

    ///starts for i : 003
    for (let i = 0; i < allElements.length; i++) {
      //////// Saving css computed with classes still active
      const target = allElements[i];
      const targetCSS = window.getComputedStyle(target);
      let cssOne = {};

      ///starts for j : 004
      for (let j = 0; j < targetCSS.length; j++) {
        const element = targetCSS[j];
        cssOne = {
          ...cssOne,
          [element]: targetCSS[element]
        };
      }
      ///ends for j : 004
      withCss.push(cssOne);
    }
    ///ends for i : 003

    //////// Delete all custom css
    document.querySelectorAll('style,link[rel="stylesheet"]').forEach(item => item.remove());

    ///starts for i : 005
    for (let i = 0; i < allElements.length; i++) {
      const target = allElements[i];
      //////// Saving standard css for comparison
      const targetCSSclean = window.getComputedStyle(target);
      let cssTwo = {};

      //////// Saving differences between versions      
      ///starts for j : 006
      for (let j = 0; j < targetCSSclean.length; j++) {
        const element = targetCSSclean[j];
        if (!(targetCSSclean[element] === withCss[i][element]) && !element.includes("webkit")) {
          cssTwo = {
            ...cssTwo,
            [element]: withCss[i][element] + "@#$"
          };
        }
      }
      ///ends for j : 006

      //////// Making output look like a css file
      if (JSON.stringify(cssTwo).length > 5) {
        cssTwo = `.custom_Tag_${target.tagName}_Classes_${target.className.toString().replace(/\s/g, '_')} ${JSON.stringify(cssTwo)
          .replace(/"|\\/g, " ")
          .replace(/@#\$ ,/g, ";\n")
          .replace("\{", "\{\n")
          .replace("\}", "\n\}")
          .replace("@#$", "")
          .replace(/ :/g, ":")
          }`;
      }
      //////// Saving one class 
      allClasses.push(cssTwo)
    }
    ///ends for i : 005

    //////// returning the file from puppeteer
    return allClasses.flat().toString().replace(/\},\./g, "}\n\n.");
  }, targetElement);

  //////// closes virtual browser
  console.log("Closing virtual browser");
  browser.close();

  //////// Saving CSS file
  console.log("Saving file");
  await fs.writeFile("./computedCSS.css", extractingElements, function (err) {
    if (err) return console.log("Error saving css! ", err);
  });

  //////// Ends
  console.log("Done!");
}

getTrees();

