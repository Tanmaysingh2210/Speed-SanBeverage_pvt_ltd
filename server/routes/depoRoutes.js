import express from 'express';

import {addDepo , getAllDepo , updateDepo , deleteDepo} from '../controllers/depoController.js';

const router = express.Router();

router.post('/', addDepo);
router.get('/',getAllDepo);
router.patch('/:id', updateDepo);
router.delete('/delete/:id',deleteDepo);

export default router;