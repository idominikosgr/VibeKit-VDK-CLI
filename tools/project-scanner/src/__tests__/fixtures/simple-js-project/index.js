// Main application entry point
const express = require('express');
const { renderApp } = require('./src/app');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(renderApp());
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
