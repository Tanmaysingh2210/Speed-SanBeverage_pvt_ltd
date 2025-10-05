const express = require('express');
const { addContainer, getAllContainer, getContainerbyID, updateContainer, deleteContainer } = require('../controllers/skuControllers/container');



const router = express.Router();

router.post('/', addContainer);
router.get('/', getAllContainer);
router.get('/:id',getContainerbyID);
router.put('/:id',updateContainer);
router.delete('/:id', deleteContainer);



module.exports = router;
