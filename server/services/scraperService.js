import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

export const scrapePage = async (url, selector) => {
  console.log(`Scraping page: ${url}`);
  let browser;
  try {
   browser = await chromium.launch({ headless: true });
    
    const page = await browser.newPage();
    await page.goto(url);

    const jobSelector = selector;
    await page.waitForSelector(jobSelector, { timeout: 15000 });

    const jobLinks = await page.evaluate((sel) => {
      const links = Array.from(document.querySelectorAll(sel));
      return links.map(link => link.href);
    }, jobSelector);

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