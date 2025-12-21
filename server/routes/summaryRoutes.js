const express = require("express");
const router = express.Router();
const {ItemWiseSummary} = require('../Summary/ItemWise.js');
const {CashChequeSummary}= require('../Summary/cashCheque.js');

router.post('/itemwise' , ItemWiseSummary);
router.post('/cashcheque', CashChequeSummary);

module.exports = router;