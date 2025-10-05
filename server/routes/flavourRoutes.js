const express = require('express');
const {addFlavour, getAllFlavour, getFlavourbyID, updateFlavour, deleteFlavour} = require('../controllers/skuControllers/flavour.js')



const router = express.Router();

router.post('/', addFlavour);
router.get('/', getAllFlavour);
router.get('/:id',getFlavourbyID);
router.patch('/:id',updateFlavour);
router.delete('/:id', deleteFlavour);



module.exports = router;