const express = require('express');
const { addLoadIn } = require('../controllers/transactionController/loadinController');
const { addLoadout } = require('../controllers/transactionController/loadOutController');
const router=express.Router();

router.post('/loadin',addLoadIn );
router.post('/loadout',addLoadout );

module.exports = router;        