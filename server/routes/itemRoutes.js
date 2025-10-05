const express = require('express');
const { addItem, getAllItems, getItembyId, updateItem, deleteItem } = require('../controllers/skuControllers/item.js');

const router = express.Router();

router.post('/', addItem);
router.get('/', getAllItems);
router.get('/:id',getItembyId);
router.patch('/:id',updateItem);
router.delete('/:id', deleteItem);

module.exports = router;