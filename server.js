const express = require('express');
const nodemailer = require('nodemailer');
const axios = require('axios');
const cron = require('node-cron');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.email',
  port: 587,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

// Function to fetch a random quote
async function getRandomQuote() {
  try {
    const response = await axios.get('https://api.quotable.io/random');
    return response.data.content;
  } catch (error) {
    console.error('Error fetching quote:', error);
    return 'Error fetching quote.';
  }
}

// Function to send the daily quote email
async function sendDailyQuote() {
  const quote = await getRandomQuote();

  const mailOptions = {
    from: 'sender@server.com',
    to: 'me.asijit@gmail.com',
    subject: 'Daily Quote',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Daily Quote</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f5f5f5;
              padding: 20px;
            }
            .quote-container {
              background-color: #fff;
              border-radius: 10px;
              padding: 20px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              max-width: 600px;
              margin: 0 auto;
            }
            .quote {
              font-size: 24px;
              font-style: italic;
              line-height: 1.5;
              margin-bottom: 20px;
            }
            .author {
              font-weight: bold;
              text-align: right;
            }
          </style>
        </head>
        <body>
          <div class="quote-container">
            <p class="quote">&ldquo;${quote}&rdquo;</p>
            <p class="author">- Quote of the Day</p>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Schedule the daily quote email to be sent at 7:00 AM
cron.schedule('0 7 * * *', sendDailyQuote);

// sendDailyQuote();

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
