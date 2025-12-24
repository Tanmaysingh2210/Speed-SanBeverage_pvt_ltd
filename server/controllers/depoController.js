const Depo =require("../models/depoModal");

exports.addDepo= async(req,res)=>{
    try{
        const {depoCode, depoName , depoAddress}= req.body;

        if(!depoCode || !depoName ){
            return res.status(400).json({message:"Depo code and Name are required"});
        }

        const depo=await Depo.findOne({depoCode});
        if(depo)return res.status(400).json({message:"Depo already exist"});

        await Depo.create({
            depoCode: depoCode.trim().toUpperCase(),
            depoName:depoName.trim().toUpperCase() ,
            depoAddress: depoAddress.trim().toUpperCase()
        });
        res.status(200).json({message:"Depo created successfully", success:true});

    }catch(err){
        res.status(500).json({message:"Error creating depo" , error : err.message});
    }
};

exports.getAllDepo=async(req,res)=>{
    try{
        const data = await Depo.find();
        if(!data)return res.status(404).json({message : "depo not found"});
        res.status(200).json(data);
    }
    catch(err){
        res.status(500).json({message:"Error fetching depo", error : err.message});
    }
};

exports.updateDepo= async (req,res)=>{
    try{
         const updated = await Depo.findByIdAndUpdate(req.params.id , req.body , {
            new : true , 
            runValidators : true 
         });
         if(!updated) return res.status(404).json ({message:"depo not found"});
         res.status(200).json(updated);
    }
    catch(err){
        res.status(500).json({ message: "Error updating Depo", error: err.message });

    }
};

exports.deleteDepo = async (req,res)=>{
    try{
        const deleted =await Depo.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "depo record not found" });
        res.status(200).json({ message: "Depo record deleted" });


    }
    catch(err){
        res.status(500).json({ message: "Error deleting depo", error: err.message });

    }
};