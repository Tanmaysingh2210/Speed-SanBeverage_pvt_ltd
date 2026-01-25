import { Flavour } from '../../models/SKU.js';
import Depo from "../../models/depoModal.js";
import mongoose from 'mongoose';

export const addFlavour = async (req, res) => {
    try {
        const { serial, name, depo } = req.body;

        if (!serial || !name, !depo) return res.status(400).json({ message: "all fields are required" });

        if (!mongoose.Types.ObjectId.isValid(depo)) {
            return res.status(400).json({ message: "Invalid depo ID" });
        }

        // 3️⃣ Check if depo exists
        const depoExists = await Depo.findById(depo);
        if (!depoExists) {
            return res.status(400).json({ message: "Depo not found" });
        }

        const existing = await Flavour.findOne({ name , depo});
        if (existing) return res.status(400).json({ message: "flavour already exists, please add different" });

        await Flavour.create({ serial, name, depo });

        res.status(200).json({ message: "flavour added successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error adding flavour", error: err.message });
    }
};


export const getAllFlavour = async (req, res) => {
    try {
        const {depo} = req.query;
        if(!depo) return res.status(400).json({message:"Depo is required"});

        if (!mongoose.Types.ObjectId.isValid(depo)) {
            return res.status(400).json({ message: "Invalid depo ID" });
        }

        const depoExists = await Depo.findById(depo);
        if (!depoExists) {
            return res.status(400).json({ message: "Depo not found" });
        }
        const flavours = await Flavour.find({depo});
        res.status(200).json(flavours);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching flavours', error: error.message });
    }
};

export const getFlavourbyID = async (req, res) => {
    try {
        const flavour = await Flavour.findById(req.params.id);
        if (!flavour) return res.status(404).json({ message: 'flavour Not found' });
        res.status(200).json(flavour);
    } catch (err) {
        res.status(500).json({ message: "Error fetching flavour ", error: err.message });
    }
};

export const updateFlavour = async (req, res) => {
    try {
        const updated = await Flavour.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Flavour updated', updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating flavour', error: error.message });
    }
};

export const deleteFlavour = async (req, res) => {
    try {
        const deleted = await Flavour.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "flavour not found" });
        res.status(200).json({ message: "flavour deleted sucessfully" });

    } catch (err) {
        res.status(500).json({ message: "error delelting flavour", error: err.message });
    }
};