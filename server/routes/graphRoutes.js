import express from 'express';
import itemwiseBarGraph  from '../statistics/itemwiseBarGraph.js';
import monthWiseLineGraph from "../statistics/monthWiseLineGraph.js";

const router = express.Router();

router.post('/bar', itemwiseBarGraph);
router.post('/line' ,monthWiseLineGraph);

export default router;