const express = require ('express');

const {addDepo , getAllDepo , updateDepo , deleteDepo} = require('../controllers/depoController.js');

const router = express.Router();

router.post('/', addDepo);
router.get('/',getAllDepo);
router.patch('/:id', updateDepo);
router.delete('/delete/:id',deleteDepo);

module.exports = router;