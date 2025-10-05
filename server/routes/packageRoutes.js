const express  = require('express');
const { addPackage, getAllPackage, getPackagebyID, updatePackage, deletePackage } = require('../controllers/skuControllers/package.js');

const router = express.Router();

router.post('/', addPackage);
router.get('/', getAllPackage);
router.get('/:id', getPackagebyID);
router.patch('/:id', updatePackage);
router.delete('/:id', deletePackage);

module.exports = router;