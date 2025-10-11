const express = require('express');
const { createCashCredit, getAllCashCredits, getCashCreditById, updateCashCredit, deleteCashCredit } = require('../../controllers/transactionController/cash_creditController');

const router = express.Router();

router.post('/add', createCashCredit);
router.get('/', getAllCashCredits);
router.get('/:id', getCashCreditById);
router.patch('/update/:id', updateCashCredit);
router.delete('/delete/:id', deleteCashCredit);

module.exports = router;