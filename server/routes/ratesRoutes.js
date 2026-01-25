import express from 'express';
import { addRate, getAllRates, getLatestByDate, getRateById, deleteRate, updateRate } from '../controllers/ratesController/ratesController.js';


const router = express.Router()

router.post("/", addRate)
router.get("/", getAllRates)
router.get("/:id", getRateById)
router.delete("/:id", deleteRate)
router.patch("/:id", updateRate)

router.get("/price", getLatestByDate);

export default router;