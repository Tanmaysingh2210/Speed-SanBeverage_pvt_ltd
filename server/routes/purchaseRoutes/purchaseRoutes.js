const express =require( 'express');
const { 
    createPurchase, 
    getAllPurchases, 
    getPurchaseById, 
    updatePurchase, 
    deletePurchase 
} =require('../../controllers/purchaseController/purchaseController.js');

const router = express.Router();

router.post('/', createPurchase);

router.get('/', getAllPurchases);

router.get('/:id', getPurchaseById);

router.put('/update/:id', updatePurchase);

router.delete('/delete/:id', deletePurchase);

module.exports = router;
