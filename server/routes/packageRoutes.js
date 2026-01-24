import express from 'express';
import { addPackage, getAllPackage, getPackagebyID, updatePackage, deletePackage } from '../controllers/skuControllers/package.js';

const router = express.Router();

router.post('/', addPackage);
router.get('/', getAllPackage);
router.get('/:id', getPackagebyID);
router.patch('/:id', updatePackage);
router.delete('/delete/:id', deletePackage);

export default router;