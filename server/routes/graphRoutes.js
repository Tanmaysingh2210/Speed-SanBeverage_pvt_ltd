import express from 'express';
import itemwiseBarGraph  from '../statistics/itemwiseBarGraph.js';

const router = express.Router();

router.post('/bar', itemwiseBarGraph);

export default router;