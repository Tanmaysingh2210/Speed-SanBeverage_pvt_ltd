import express from 'express';
import { addContainer, getAllContainer, getContainerbyID, updateContainer, deleteContainer } from '../controllers/skuControllers/container.js';



const router = express.Router();

router.post('/', addContainer);
router.get('/', getAllContainer);
router.get('/:id',getContainerbyID);
router.patch('/:id',updateContainer);
router.delete('/delete/:id', deleteContainer);



export default router;
