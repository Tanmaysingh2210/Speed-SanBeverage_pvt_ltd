import express from 'express';
import { createCashCredit, getAllCashCredits, getCashCreditById, updateCashCredit, deleteCashCredit, getOneCashCredit } from '../../controllers/transactionController/cash_creditController.js';

const router = express.Router();

router.post('/add', createCashCredit);

router.post('/getone', getOneCashCredit);

router.get('/', getAllCashCredits);
router.get('/:id', getCashCreditById);
router.patch('/update/:id', updateCashCredit);
router.delete('/delete/:id', deleteCashCredit);

export default router;