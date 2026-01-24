import express from 'express';
import {addFlavour, getAllFlavour, getFlavourbyID, updateFlavour, deleteFlavour} from '../controllers/skuControllers/flavour.js'



const router = express.Router();

router.post('/', addFlavour);
router.get('/', getAllFlavour);
router.get('/:id',getFlavourbyID);
router.patch('/:id',updateFlavour);
router.delete('/delete/:id', deleteFlavour);



export default router;