import puppeteer from "puppeteer";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

export async function extractNewsText(url) {
  if (!url) {
    console.error("❌ Please provide a valid URL.");
    return null;
  }

  const browser = await puppeteer.launch({ headless: true }); // Use true for better performance
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    // Ensure page has loaded content
    await page.waitForSelector("body", { timeout: 10000 });

    // Fetch HTML content
    const htmlContent = await page.evaluate(() => {
      document.querySelectorAll("style, link[rel='stylesheet'], script").forEach(el => el.remove());
      return document.documentElement.outerHTML;
    });

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
