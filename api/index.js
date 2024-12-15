const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for all origins (you can specify origins like ['https://yourfrontend.com'] if needed)
app.use(cors());

// The range of your Google Sheets data
const spreadsheetId = process.env.FILE_ID1;

const chatJsonString = process.env.CHATBOT_CONFIG;
let chat;

try {
  chat = JSON.parse(chatJsonString);
} catch (error) {
  console.error('Error parsing CHATBOT_CONFIG JSON:', error);
  chat = {};
}

const credentials = chat;

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Route to fetch and transform data from Google Sheets
app.get('/api', async (req, res) => {  // Make sure this endpoint is consistent with your frontend request
  const range = 'A3:C15'; // Adjust the range if necessary
  
  if (!spreadsheetId) {
    console.error('No spreadsheet ID found in environment variables.');
    res.status(500).send('Spreadsheet ID is missing.');
    return;
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const { values } = response.data;

    console.log("Raw Data: ", values); // Log raw data for debugging

    if (!values || values.length < 2) {
      res.status(400).send('No data found or insufficient data.');
      return;
    }

    // Extract headers and data rows
    const [headers, ...rows] = values;

    // Transform rows into key-value pairs, with "Currency", "BUY", and "SELL" as keys
    const data = rows.map(row => {
      const entry = {};
      entry['Currency'] = row[0] || ''; // Assign the currency pair to "Currency"
      entry['BUY'] = row[1] || '';      // Assign the BUY value
      entry['SELL'] = row[2] || '';     // Assign the SELL value
      return entry;
    });

    res.json(data); // Send the transformed data as the response
    console.log('Fetched and transformed sheet data');
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
