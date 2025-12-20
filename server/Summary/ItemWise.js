const LoadOut = require('../models/transaction/LoadOut');

exports.ItemWiseSummary = aysnc (req,res) => {
    try{
        const {startDate,endDate} = req.body;

        if(!startDate || !endDate) return res.status(400).json({message:"All field are required",success:false});
        
    }
    catch(err){

    }
}