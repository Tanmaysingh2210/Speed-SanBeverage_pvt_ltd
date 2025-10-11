const express = require('express');
const router = express.Router();

const loadoutRoutes = require('./transactionRoutes/loadoutRoutes');
const loadinRoutes = require('./transactionRoutes/loadinRoutes');
const cashcreditRoutes = require('./transactionRoutes/cashcreditRoutes');

router.use('/loadout', loadoutRoutes);
router.use('/loadin', loadinRoutes);
router.use('/cashcredit', cashcreditRoutes);

module.exports = router;