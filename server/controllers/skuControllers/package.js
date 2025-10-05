const { Package } = require('../../models/SKU');

exports.addPackage = async (req, res) => {
    try {
        const { serial, name } = req.body;
        if(!serial || !name) return res.status(400).json({message: "package and serial no. are required"});
        const existing = await Package.findOne({ name });
        if (existing) return res.status(400).json({ message: "package already exists, please add different" });

        await Package.create({ serial, name });

        res.status(200).json({ message: "package added successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error adding package", error: err.message });
    }
};



exports.getAllPackage = async (req, res) => {
    try {
        const packages = await Package.find();
        res.status(200).json(packages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching packages', error: error.message });
    }
};

exports.getPackagebyID = async (req, res) => {
    try {
        const package = await Package.findById(req.params.id);
        if (!package) return res.status(404).json({ message: 'package Not found' });
        res.status(200).json(package);
    } catch (err) {
        res.status(500).json({ message: "Error fetching package ", error: err.message });
    }
};

exports.updatePackage = async (req, res) => {
    try {
        const updated = await Package.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Package updated', updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating package', error: error.message });
    }
};

exports.deletePackage = async (req,res) => {
    try{
        const deleted =await  Package.findByIdAndDelete(req.params.id);
        if(!deleted) return res.status(404).json({message:"package not found"});
        res.status(200).json({message:"package deleted sucessfully"});

    }catch(err){
        res.status(500).json({message:"error delelting package", error:err.message});
    }
};