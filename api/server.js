// server.js
require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const cardRouter = require('../routes/card.route');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mount your cardRouter under /api
app.use('/api', cardRouter);

app.get('/', (req, res) => {
  res.send('NFC Auth Backend Server is running!');
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
module.exports = app;
module.exports.handler = serverless(app);
// don’t call app.listen() in a serverless env

