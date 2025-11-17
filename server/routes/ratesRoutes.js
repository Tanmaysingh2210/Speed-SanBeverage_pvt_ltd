const express = require('express');
const { addRate, getAllRates, getLatestByDate, getRateById, deleteRate, updateRate } = require('../controllers/ratesController/ratesController');
const Rate = require('../models/rates')


const router = express.Router()

router.post("/", addRate)
router.get("/", getAllRates)
router.get("/:id", getRateById)
router.delete("/:id", deleteRate)
router.patch("/:id", updateRate)

router.get("/price", getLatestByDate);

module.exports = router;