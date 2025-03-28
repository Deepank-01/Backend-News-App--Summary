// import puppeteer from "puppeteer";

// export async function extractNewsText(url) {
//     if (!url) {
//       console.log("Please provide a valid URL.");
//       return;  // This returns `undefined` if no URL is provided
//     }
  
//     const browser = await puppeteer.launch({ headless: "new" });
//     const page = await browser.newPage();
  
//     try {
//       await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  
//       const newsText = await page.evaluate(() => {
//         let article = document.querySelector("article") || document.body;
//         return article.innerText.trim();  // ✅ This value is returned to `newsText`
//       });
  
//       return newsText;  // ✅ This returns the extracted text from the webpage
//     } catch (error) {
//       console.error("Error extracting news:", error);
//       return null;  // ✅ Returns `null` if an error occurs
//     } finally {
//       await browser.close();
//     }
//   }
  

import puppeteer from "puppeteer";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

export async function extractNewsText(url) {
  if (!url) {
    console.log("Please provide a valid URL.");
    return;
  }

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    // Get raw HTML of the page, but exclude stylesheets
    const htmlContent = await page.evaluate(() => {
      // Remove stylesheets and scripts before sending to JSDOM
      document.querySelectorAll("style, link[rel='stylesheet'], script").forEach(el => el.remove());
      return document.documentElement.outerHTML;
    });

    // Use JSDOM without parsing CSS to prevent errors
    const dom = new JSDOM(htmlContent, { resources: "usable", pretendToBeVisual: true });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      console.log("Failed to extract clean text.");
      return null;
    }

    return article.textContent.trim();
  } catch (error) {
    console.error("Error extracting news:", error);
    return null;
  } finally {
    await browser.close();
  }
}
