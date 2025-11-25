const express =require( 'express');

//purchaseEntry
const { 
    createPurchase, 
    getAllPurchases, 
    getPurchaseById, 
    updatePurchase, 
    deletePurchase 
} =require('../../controllers/purchaseController/purchaseController.js');

//purchaseItemwise
const {
    createPurchaseItemwise,
    getAllPurchaseItemwise,
    getPurchaseItemwiseById,
    updatePurchaseItemwise,
    deletePurchaseItemwise
} = require('../../controllers/purchaseController/purchaseItemwise.js');

//purchaseEntry
const router = express.Router();

router.post('/', createPurchase);

router.get('/', getAllPurchases);

router.get('/:id', getPurchaseById);

router.put('/update/:id', updatePurchase);

router.delete('/delete/:id', deletePurchase);

//purchaseItemwise'
router.post('/itemwise', createPurchaseItemwise);
router.get('/itemwise', getAllPurchaseItemwise);
router.get('/itemwise/:id', getPurchaseItemwiseById);
router.put('/itemwise/update/:id', updatePurchaseItemwise);
router.delete('/itemwise/delete/:id', deletePurchaseItemwise);

module.exports = router;
