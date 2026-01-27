import { Container } from '../../models/SKU.js';

export const addContainer = async (req, res) => {
    try {
        const { serial, name } = req.body;

        if (!serial || !name) return res.status(400).json({ message: "all fields are required" });
        const depo = req.user?.depo;


        const existing = await Container.findOne({ name, depo });
        if (existing) return res.status(400).json({ message: "container already exists, please add different" });

        await Container.create({ serial, name, depo });

        res.status(200).json({ message: "container added successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error adding container", error: err.message });
    }
};

export const getAllContainer = async (req, res) => {
    try {

        const containers = await Container.find({ depo: req.user?.depo });
        res.status(200).json(containers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching containers', error: error.message });
    }
};

export const getContainerbyID = async (req, res) => {
    try {
        const container = await Container.findOne({ _id: req.params.id, depo: req.user?.depo });
        if (!container) return res.status(404).json({ message: 'Container Not found' });
        res.status(200).json(container);
    } catch (err) {
        res.status(500).json({ message: "Error fetching container ", error: err.message });
    }
};

export const updateContainer = async (req, res) => {
    try {
        const updated = await Container.findOneAndUpdate(
            { _id: req.params.id, depo: req.user?.depo },
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Container updated', updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating container', error: error.message });
    }
};

export const deleteContainer = async (req, res) => {
    try {
        const deleted = await Container.findOneAndDelete({ _id: req.params.id, depo: req.user?.depo });
        if (!deleted) return res.status(404).json({ message: "Container not found" });
        res.status(200).json({ message: "container deleted sucessfully" })

    } catch (err) {
        res.status(500).json({ message: "error delelting container", error: err.message });
    }
};