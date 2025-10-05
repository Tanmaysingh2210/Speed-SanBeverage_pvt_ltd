const express = require('express');
const {addSalesman, getAllSalesmen, getSalesmanById, updateSalesman, deleteSalesman}=require('../controllers/salesmanController/salesmanController.js')

const router=express.Router();

router.post('/', addSalesman);
router.get('/', getAllSalesmen);
router.get('/:id', getSalesmanById);
router.patch('/:id', updateSalesman);
router.delete('/:id', deleteSalesman);

module.exports = router;        