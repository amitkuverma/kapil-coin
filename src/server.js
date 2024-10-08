const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 4200;

// Serve static files from the dist directory
console.log(__dirname)
app.use(express.static(path.join(__dirname, 'dist/kapil-coin')));

// Route all other requests to index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/kapil-coin/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
