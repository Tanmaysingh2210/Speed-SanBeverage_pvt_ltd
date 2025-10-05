const { Container } = require('../../models/SKU');

exports.addContainer = async (req, res) => {
    try {
        const { serial, name } = req.body;

        if (!serial || !name) return res.status(400).json({ message: "container and serial no. are required" });

        const existing = await Container.findOne({ name });
        if (existing) return res.status(400).json({ message: "container already exists, please add different" });

        await Container.create({ serial, name });

        res.status(200).json({ message: "container added successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error adding container", error: err.message });
    }
};

exports.getAllContainer = async (req, res) => {
    try {
        const containers = await Container.find();
        res.status(200).json(containers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching containers', error: error.message });
    }
};

exports.getContainerbyID = async (req, res) => {
    try {
        const container = await Container.findById(req.params.id);
        if (!container) return res.status(404).json({ message: 'Container Not found' });
        res.status(200).json(container);
    } catch (err) {
        res.status(500).json({ message: "Error fetching container ", error: err.message });
    }
};

exports.updateContainer = async (req, res) => {
    try {
        const updated = await Container.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Container updated', updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating container', error: error.message });
    }
};

exports.deleteContainer = async (req,res) => {
    try{
        const deleted =await  Container.findByIdAndDelete(req.params.id);
        if(!deleted) return res.status(404).json({message:"Container not found"});
        res.status(200).json({message:"container deleted sucessfully"})

    }catch(err){
        res.status(500).json({message:"error delelting container", error:err.message});
    }
};