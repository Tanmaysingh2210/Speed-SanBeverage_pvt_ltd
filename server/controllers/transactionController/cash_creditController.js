const CashCredit = require('../../models/transaction/CashCredit');

exports.createCashCredit = async (req, res) => {
    try {
        const { crNo, date, salesmanCode, trip, value,ref,cashDeposited, chequeDeposited, tax, remark } = req.body;

        if (!crNo || !date || !salesmanCode || !trip || !value || !tax) return res.status(400).json({ message: "All fields are required" });

        await CashCredit.create({
            crNo,
            salesmanCode,
            date,
            trip,
            value,
            tax,
            ref,
            cashDeposited,
            chequeDeposited,
            remark
        });

        res.status(201).json({ message: "New Cash/Credit created sucessfully" });
    } catch (err) {
        res.status(500).json({ message: "Error creating cash/ credit", error: err.message });
    }
};

exports.getAllCashCredits = async (req, res) => {
    try {
        const data = await CashCredit.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching records', error: error.message });
    }
};

exports.getCashCreditById = async (req, res) => {
    try {
        const data = await CashCredit.findById(req.params.id);
        if (!data) return res.staus(404).json({ message: "Record not found" });

        res.staus(200).json(data);

    } catch (err) { 
        res.status(500).json({message: "Error fetching cash credit by id", error:err.message});
    }
};

exports.updateCashCredit = async (req ,res) =>{
    try{
        const updated =await  CashCredit.findByIdAndUpdate(req.params.id , req.body , {
            new:true, runValidators:true
        });
        if(!updated) return res.status(404).json({message:"Record not found"});
        res.status(200).json({message:"Record updated sucessfully", data:updated});
    }catch(err){
        res.status(500).json({message:"Error updating records",error: err.message});
    }
};

exports.deleteCashCredit = async (req ,res) =>{
    try{
        const deleted = CashCredit.findByIdAndDelete(req.params.id);
        if(!deleted) return res.status(404).json({message:"Record not found"});
        res.status(200).json({message:"Record deleted sucessfully"});

    }catch(err){
        res.status(500).json({message:"Error deleting Record", error:err.message});
    }
};