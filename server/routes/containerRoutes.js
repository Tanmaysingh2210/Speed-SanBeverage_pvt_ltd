const express = require('express');
const { addContainer, getAllContainer, getContainerbyID, updateContainer, deleteContainer } = require('../controllers/skuControllers/container.js');



const router = express.Router();

router.post('/', addContainer);
router.get('/', getAllContainer);
router.get('/:id',getContainerbyID);
router.patch('/:id',updateContainer);
router.delete('/delete/:id', deleteContainer);


module.exports = router;
