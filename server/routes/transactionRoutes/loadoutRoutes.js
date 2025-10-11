const express = require('express');
const { addLoadout, getAllLoadOut, getLoadOutById, updateLoadOut, deleteLoadOut } = require('../../controllers/transactionController/loadOutController');


const router = express.Router();

router.post("/add", addLoadout);
router.get('/', getAllLoadOut);
router.get('/:id', getLoadOutById);
router.patch('/update/:id', updateLoadOut);
router.delete('/delete/:id', deleteLoadOut);

module.exports = router;