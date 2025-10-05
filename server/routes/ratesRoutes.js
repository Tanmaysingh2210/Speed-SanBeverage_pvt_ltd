const express = require('express');
const { addRate, getAllRates, getRateById, deleteRate, updateRate } = require('../controllers/ratesController/ratesController')

const router=express.Router()

router.post("/" ,addRate )
router.get("/" ,getAllRates )
router.get("/:id" ,getRateById ) 
router.delete("/:id" ,deleteRate ) 
router.patch("/:id" ,updateRate ) 

module.exports = router;