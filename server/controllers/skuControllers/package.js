import { Package } from '../../models/SKU.js';

export const addPackage = async (req, res) => {
    try {
        const { serial, name } = req.body;
        if (!serial || !name) return res.status(400).json({ message: "all fields are required" });

        const depo = req.user?.depo;

        const existing = await Package.findOne({ name, depo });
        if (existing) return res.status(400).json({ message: "package already exists, please add different" });

        await Package.create({ serial, name, depo });

        res.status(200).json({ message: "package added successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error adding package", error: err.message });
    }
};


export const getAllPackage = async (req, res) => {
    try {
        const packages = await Package.find({ depo: req.user?.depo });
        res.status(200).json(packages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching packages', error: error.message });
    }
};

export const getPackagebyID = async (req, res) => {
    try {
        const pkg = await Package.findOne({ _id: req.params.id, depo: req.user?.depo });
        if (!pkg) return res.status(404).json({ message: 'package Not found' });
        res.status(200).json(pkg);
    } catch (err) {
        res.status(500).json({ message: "Error fetching package ", error: err.message });
    }
};

export const updatePackage = async (req, res) => {
    try {
        const updated = await Package.findOneAndUpdate(
            { _id: req.params.id, depo: req.user?.depo },
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Package updated', updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating package', error: error.message });
    }
};

export const deletePackage = async (req, res) => {
    try {
        const deleted = await Package.findOneAndDelete({ _id: req.params.id, depo: req.user?.depo });
        if (!deleted) return res.status(404).json({ message: "package not found" });
        res.status(200).json({ message: "package deleted sucessfully" });

    } catch (err) {
        res.status(500).json({ message: "error delelting package", error: err.message });
    }
};