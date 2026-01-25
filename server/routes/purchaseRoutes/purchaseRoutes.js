import express from 'express';

//purchaseEntry
import { 
    createPurchase, 
    getAllPurchases, 
    getPurchaseById, 
    updatePurchase, 
    deletePurchase 
} from '../../controllers/purchaseController/purchaseController.js';

//purchaseItemwise
import {
    createPurchaseItemwise,
    getAllPurchaseItemwise,
    getPurchaseItemwiseById,
    updatePurchaseItemwise,
    deletePurchaseItemwise
} from '../../controllers/purchaseController/purchaseItemwise.js';

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

export default router;
