const LoadOut = require("../../models/transaction/LoadOut");

exports.addLoadout = async (req, res) => {
    try {
        const { salesmanCode, itemCode, Date, qty } = req.body;

        if (!salesmanCode || !itemCode || !Date || !qty) return res.status(400).json({ message: "All fields are required" });

        const existing = await LoadOut.findOne({ salesmanCode: salesmanCode, itemCode: itemCode, Date: Date });

        if (existing) return res.status(400).json({ message: `Loadout record of ${salesmanCode} at ${Date} exist for item: ${itemCode}` });

        await LoadOut.create({
            salesmanCode: salesmanCode,
            Date: Date,
            itemCode: itemCode,
            qty: qty
        });

        res.status(200).json({ message: "loadout added sucessfully" });

    } catch (err) {
        res.status(500).json({ message: "Error adding loadOut", error: err.message });
    }
};

exports.getAllLoadOut = async (req, res) => {
    try {
        const data = await LoadOut.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({message:"Error fetching loadout record",error:err.message});
    }
};

exports.getLoadOutById  = async (req , res) =>{
    try{
        const data = await LoadOut.findById(req.params.id);
        if(!data) return res.status(404).json({message:"Record not found"});
        res.status(200).json(data);
    }catch(err){
        res.status(500).json({message:"Error fetching reccord", error:err.message});
    }
};

exports.updateLoadOut = async (req , res) =>{
    try {
        const updated = await LoadOut.findByIdAndUpdate(req.params.id, req.body , {
            new:true,
            runValidators:true
        });
        if(!updated) return res.status(404).json({message:"Loadout record not found"});
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({message:"Error updating LoadOut", error:err.message});
    }
};

exports.deleteLoadOut = async (req , res) => {
  try {
    const deleted = await LoadOut.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({message:"Loadout record not found"});
    res.status(200).json({message:"LoadOut record deleted"});
  } catch (err) {
    res.status(500).json({message:"Error deleting loadout", error:err.message});
  }
};




