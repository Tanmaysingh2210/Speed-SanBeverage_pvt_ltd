import express from 'express';
import {addSalesman, getAllSalesmen, getSalesmanById, updateSalesman, deleteSalesman} from '../controllers/salesmanController/salesmanController.js';

const router=express.Router();

router.post('/', addSalesman);
router.get('/', getAllSalesmen);
router.get('/:id', getSalesmanById);
router.patch('/:id', updateSalesman);
router.delete('/delete/:id', deleteSalesman);

export default router;        