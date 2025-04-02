import puppeteer from "puppeteer";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

export async function extractNewsText(url) {
  if (!url) {
    console.error("❌ Please provide a valid URL.");
    return null; 
  }

  // Puppeteer configuration that works both locally and on Render
  const browser = await puppeteer.launch({
    headless: true, // New headless mode
    ignoreDefaultArgs: ["--disable-extensions"],
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-accelerated-2d-canvas',
      '--disable-dev-shm-usage',
      '--disable-web-security',
    ],
    ignoreHTTPSErrors: true,
  });
  console.log("Above the putter")
  const page = await browser.newPage();
  
  await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36")
  console.log("Below the putter")
  try {
    await page.goto(url, { 
      waitUntil: "domcontentloaded", 
      timeout: 30000 
    });

    // Ensure page has loaded content
    await page.waitForSelector("body", { timeout: 10000 });
     console.log("After the page loaded")
    // Fetch HTML content
    const htmlContent = await page.evaluate(() => {
      document.querySelectorAll("style, link[rel='stylesheet'], script").forEach(el => el.remove());
      return document.documentElement.outerHTML;
    });
 console.log("After html contain loaded")
    // Parsing the page content using JSDOM and Readability
    const dom = new JSDOM(htmlContent, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      console.error("⚠️ Failed to extract content using Readability.");
      return null;
    }

    return article.textContent.trim();
  } catch (error) {
    if (error.message.includes("Navigation timeout")) {
      console.error("⏳ Website took too long to load. Try increasing the timeout.");
    } else {
      console.error("❌ Error extracting news:", error);
    }
    return null;
  } finally {
    await browser.close();
  }
}