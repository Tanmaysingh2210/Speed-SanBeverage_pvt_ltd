import express from 'express';
import { addLoadIn, getAllLoadIn, getLoadIn, updateLoadIn, deleteLoadIn } from '../../controllers/transactionController/loadinController.js';

const router = express.Router();

router.post('/add', addLoadIn);
router.get('/', getAllLoadIn);
router.post('/', getLoadIn);
router.patch('/update/:id', updateLoadIn);
router.delete('/delete/:id', deleteLoadIn);

export default router;