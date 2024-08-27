const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '/')));

// Handle root URL request
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.listen(5500, () => {
  console.log('Server is running on http://localhost:5500');
});
