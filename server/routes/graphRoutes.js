import express from 'express';
import itemwiseBarGraph  from '../statistics/itemwiseBarGraph.js';
import monthWiseLineGraph from "../statistics/monthWiseLineGraph.js";
import salesmanwiseBarGraph from '../statistics/salesmanwiseBarGraph.js';

const router = express.Router();

router.post('/bar-item', itemwiseBarGraph);
router.post('/line' ,monthWiseLineGraph);
router.post('/bar-salesman', salesmanwiseBarGraph);

export default router;