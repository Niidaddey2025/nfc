// routes/card.route.js
const express = require('express');
const verifyCardNumber = require('../controller/cardController');
const router = express.Router();

// add the leading slash here
router.get('/validate-card', verifyCardNumber);

module.exports = router;
