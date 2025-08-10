import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

export const sendNewJobNotification = async (jobUrl) => {
  console.log(`Sending email for new job: ${jobUrl}`);
  try {
    await transporter.sendMail({
      from: `"My Job Scraper" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: '🎉 New Fresher Job Found!',
      html: `
        <h3>A new job matching your criteria was found!</h3>
        <p>A new opportunity has been posted. Apply now before it's too late!</p>
        <p><strong>Job Link:</strong> <a href="${jobUrl}">${jobUrl}</a></p>
        <br>
        <p>Good luck!</p>
      `,
    });
    console.log('✅ Notification email sent successfully!');
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};