const express = require('express');
const { addLoadIn, getAllLoadIn, getLoadInById, updateLoadIn, deleteLoadIn } = require('../../controllers/transactionController/loadinController');

const router = express.Router();

router.post('/add', addLoadIn);
router.get('/', getAllLoadIn);
router.get('/:id', getLoadInById);
router.patch('/update/:id', updateLoadIn);
router.delete('/delete/:id', deleteLoadIn);

module.exports = router;