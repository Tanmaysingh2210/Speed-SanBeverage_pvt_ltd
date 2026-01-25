import express from "express";
const router = express.Router();
import { ItemWiseSummary } from '../Summary/ItemWise.js';
import { CashChequeSummary } from '../Summary/cashCheque.js';
import { salesmanwiseItemwiseSummary } from '../Summary/SalesmanwiseItemwise.js';
import { EmtAndMtSummary } from '../Summary/emtAndMt.js';
import { DaywiseSummary } from '../Summary/daywiseSummary.js';
import {shortExcessSummary} from '../Summary/ShortExcessSummary.js';

router.post('/itemwise', ItemWiseSummary);
router.post('/cashcheque', CashChequeSummary);
router.get('/salesman-wise-item-wise', salesmanwiseItemwiseSummary);
router.get('/short-excess-summary', shortExcessSummary);
router.post('/emtandmt', EmtAndMtSummary);
router.post('/daywise', DaywiseSummary);

export default router;