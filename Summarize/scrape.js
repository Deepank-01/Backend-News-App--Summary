import axios from 'axios';
import * as cheerio from 'cheerio';

export async function extractNewsText(url) {
  try {
    // 1. Fetch HTML (with headers to mimic a browser)
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 10000,
    });

    // 2. Load HTML into Cheerio
    const $ = cheerio.load(data);

    // 3. Remove junk (scripts, ads, etc.)
    $('script, style, iframe, noscript, meta, link').remove();

    // 4. Extract main content (customize per site)
    let text = '';
    const selectors = [
      'article', // Common news article container
      '.article-body', 
      '#main-content',
      'body' // Fallback
    ];

    for (const selector of selectors) {
      if ($(selector).length > 0) {
        text = $(selector).text().trim();
        break;
      }
    }

    if (!text) throw new Error("No content found");
    return text;
  } catch (error) {
    console.error(`❌ Cheerio failed (${url}):`, error.message);
    return null;
  }
}