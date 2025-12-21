const express = require("express");
const router = express.Router();
const {ItemWiseSummary} = require('../Summary/ItemWise.js');
const {CashChequeSummary}= require('../Summary/cashCheque.js');
const {salesmanwiseItemwiseSummary}= require('../Summary/SalesmanwiseItemwise.js');

router.post('/itemwise' , ItemWiseSummary);
router.post('/cashcheque', CashChequeSummary);
router.get('/salesman-wise-item-wise', salesmanwiseItemwiseSummary);

module.exports = router;