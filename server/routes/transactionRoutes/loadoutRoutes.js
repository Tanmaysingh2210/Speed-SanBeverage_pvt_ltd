import express from 'express';
import { addLoadout, getLoadOut, getAllLoadOuts, updateLoadOut, deleteLoadOut } from '../../controllers/transactionController/loadOutController.js';


const router = express.Router();

router.post("/add", addLoadout);
router.post('/', getLoadOut);
router.get('/', getAllLoadOuts);
router.patch('/update/:id', updateLoadOut);
router.delete('/delete/:id', deleteLoadOut);

export default router;