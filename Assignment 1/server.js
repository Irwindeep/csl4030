const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();
require('dotenv').config();

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: "root",
  password: process.env.PASSWORD,
  database: 'hotel_management'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Serve static files
app.use(express.static(path.join(__dirname, '/')));

// Route to serve HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'report.html'));
});

// API endpoint to get booking data
app.get('/data', (req, res) => {
  db.query('SELECT * FROM bookings', (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Server Error');
      return;
    }
    res.json(results);
  });
});

app.get('/data/report', (req, res) => {
  db.query('SELECT sum(price), count(price)/(SELECT count(room_no) FROM rooms)*100 FROM rooms WHERE rooms.status = "Booked"', (err, results) => {
    res.json(results);
  });
});

// Start the server
app.listen(5500, () => {
  console.log('Server is running on http://localhost:5500');
});
