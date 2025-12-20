const express = require("express");
const router = express.Router();
const {ItemWiseSummary} = require('../Summary/ItemWise.js');

router.post('/itemwise' , ItemWiseSummary);

module.exports = router;