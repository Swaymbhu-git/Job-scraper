import mongoose from 'mongoose';
import cron from 'node-cron';
import 'dotenv/config';

import FoundJob from './models/FoundJob.js';
import { sendNewJobNotification } from './services/emailService.js';
import { scrapePage } from './services/scraperService.js';

// ===================================================================
//  To add a new site, just add a new object to this WATCHLIST array.
// ===================================================================
const WATCHLIST = [
    {
    name: 'ServiceNow University',
    url: 'https://careers.servicenow.com/jobs/?search=&team=Early+In+Career&country=India&pagesize=20#results',
    selector: 'a[class*="js-view-job"]',
  },
  {
    name: 'Amazon University',
    url: 'https://www.amazon.jobs/content/en/career-programs/university?country%5B%5D=IN&category%5B%5D=Software+Development&employment-type%5B%5D=Full+time&team%5B%5D=studentprograms.team-jobs-for-grads&role-type%5B%5D=0',
    selector: 'a[class*="title"]',
  },
  
  // {
  //   name: 'Microsoft University',
  //   url: 'YOUR_FILTERED_MICROSOFT_URL',
  //   selector: 'a[data-bi-v*="job-opening"]',
  // },
];
// ===================================================================

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully.'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- CORE SCRAPER LOGIC ---
const checkJobs = async () => {
  console.log('------------------------------------');
  console.log(`Starting job check at: ${new Date().toLocaleString()}`);

  for (const site of WATCHLIST) {
    console.log(`Checking site: ${site.name}`);
    const jobLinks = await scrapePage(site.url, site.selector);

    for (const link of jobLinks) {
      try {
        const existingJob = await FoundJob.findOne({ jobUrl: link });
        if (!existingJob) {
          console.log(`🚀 NEW JOB FOUND: ${link}`);
          const newJob = new FoundJob({ jobUrl: link });
          await newJob.save();
          await sendNewJobNotification(link);
        }
      } catch (error) {
        console.error(`❌ Error processing link ${link}:`, error);
      }
    }
  }
  console.log('Finished job check.');
  console.log('------------------------------------\n');
};

// --- SCHEDULER ---
cron.schedule('*/3 * * * *', () => {
  console.log('🕒 Cron job triggered. Running the job checker...');
  checkJobs();
});

console.log('✅ Simplified job scraper started.');
checkJobs(); // Run once immediately on start