const express = require('express');
const { addLoadout, getLoadOut, getAllLoadOuts, updateLoadOut, deleteLoadOut } = require('../../controllers/transactionController/loadOutController');


const router = express.Router();

router.post("/add", addLoadout);
router.post('/', getLoadOut);
router.get('/', getAllLoadOuts);
router.patch('/update/:id', updateLoadOut);
router.delete('/delete/:id', deleteLoadOut);

module.exports = router;