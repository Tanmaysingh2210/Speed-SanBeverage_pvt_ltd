const express = require('express');
const { addLoadIn, getAllLoadIn, getLoadIn, updateLoadIn, deleteLoadIn } = require('../../controllers/transactionController/loadinController');

const router = express.Router();

router.post('/add', addLoadIn);
router.get('/', getAllLoadIn);
router.post('/', getLoadIn);
router.patch('/update/:id', updateLoadIn);
router.delete('/delete/:id', deleteLoadIn);

module.exports = router;