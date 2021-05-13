const targetUrl = "http://localhost:3000";
const pageName = "index";

////////////////////////////////////////////////

const puppeteer = require("puppeteer");
const fs = require("fs");

////////////////////////////////////////////////

const getTrees = async () => {

  //////// Cache config to make pupppeter faster
  const browser = await puppeteer.launch({
    userDataDir: "cacheData",
  });

  //////// Alocating the new page
  const page = await browser.newPage();

  //////// Setting screen size
  await page.setViewport({ width: 1440, height: 633 });

  //////// Opens targeted url
  await page.goto(targetUrl);

  const pageTree = await page.evaluate(() => {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const treeOfElements = [];
    const allBodyElement = document.getElementById("__next").children;

    ////////////////////////////////////////////////
    for (let i = 0; i < allBodyElement.length; i++) {

      const element = allBodyElement[i];
      const elementChildren = element.children;
      const treeOfChilds = [];

      ////////////////////////////////////////////////
      for (let j = 0; j < elementChildren.length; j++) {
        const child = elementChildren[j];

        ////////////////////////
        treeOfChilds.push({
          width: child.offsetWidth,
          height: child.offsetHeight,
          left: child.offsetLeft
        })
      }

      ////////////////////////
      if (element.offsetWidth > 0 && element.offsetHeight > 0) {
        treeOfElements.push({
          width: element.offsetWidth,
          height: element.offsetHeight,
          left: element.offsetLeft,
          children: treeOfChilds
        })
      }
    }
    return treeOfElements;
  });

  browser.close();
  await fs.writeFile("src/pagesTrees/" + pageName + "Tree.json", JSON.stringify(pageTree), function (err) {
    if (err) return console.log("Erro ao salvar arquivo: ", err);
  });

}

getTrees();

