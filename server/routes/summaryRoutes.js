const express = require("express");
const router = express.Router();
const {ItemWiseSummary} = require('../Summary/ItemWise.js');
const {CashChequeSummary}= require('../Summary/cashCheque.js');
const {salesmanwiseItemwiseSummary}= require('../Summary/SalesmanwiseItemwise.js');
const {shortExcessSummary}= require('../Summary/ShortExcessSummary.js')
const {EmtAndMtSummary} =require('../Summary/emtAndMt.js');

router.post('/itemwise' , ItemWiseSummary);
router.post('/cashcheque', CashChequeSummary);
router.get('/salesman-wise-item-wise', salesmanwiseItemwiseSummary);
router.get('/short-excess-summary', shortExcessSummary);
router.post('/emtandmt' , EmtAndMtSummary);

module.exports = router;