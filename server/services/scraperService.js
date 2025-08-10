import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

// A list of real-world browser user agents to rotate through
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
];

export const scrapePage = async (url, selector) => {
  console.log(`Scraping page: ${url}`);
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    
    const context = await browser.newContext({
      // Pick a random user agent for each request
      userAgent: USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
    });

    const page = await context.newPage();
    
    // IMPROVEMENT 1: Increase timeout and change waiting strategy.
    // 'networkidle' waits until the network traffic has calmed down,
    // which is great for modern JavaScript-heavy sites.
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); // 60-second timeout

    // IMPROVEMENT 2: Increase the selector timeout as well.
    await page.waitForSelector(selector, { timeout: 30000 }); // 30-second timeout

    const jobLinks = await page.evaluate((sel) => {
      const links = Array.from(document.querySelectorAll(sel));
      return links.map(link => link.href);
    }, selector);

    console.log(`Found ${jobLinks.length} job links.`);
    return jobLinks;

  } catch (error) {
    console.error(`❌ Error scraping ${url}:`, error.message);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};