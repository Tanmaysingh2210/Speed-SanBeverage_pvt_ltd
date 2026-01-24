import express from 'express';
import { addItem, getAllItems, getItembyId, updateItem, deleteItem } from '../controllers/skuControllers/item.js';

const router = express.Router();

router.post('/', addItem);
router.get('/', getAllItems);
router.get('/:id',getItembyId);
router.patch('/:id',updateItem);
router.delete('/delete/:id', deleteItem);

export default router;