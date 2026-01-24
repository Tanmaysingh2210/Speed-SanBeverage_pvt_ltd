import CashCredit from '../../models/transaction/CashCredit.js';
import Depo from "../../models/depoModal.js";
import mongoose from 'mongoose';

export const createCashCredit = async (req, res) => {
    try {
        const { crNo, date, salesmanCode, trip, value, ref, cashDeposited, chequeDeposited, tax, remark, depo } = req.body;

        if (!crNo || !date || !salesmanCode || !trip || !value || !tax || !depo) return res.status(400).json({ message: "All fields are required" });

        if (!mongoose.Types.ObjectId.isValid(depo)) {
            return res.status(400).json({ message: "Invalid depo ID" });
        }

        const depoExists = await Depo.findById(depo);
        if (!depoExists) {
            return res.status(400).json({ message: "Depo not found" });
        }

        const cash_credit = await CashCredit.findOne({
            crNo, date, salesmanCode, trip, depo
        });

        if (cash_credit) return res.status(400).json({ message: "Record already exist" });

        await CashCredit.create({
            crNo,
            salesmanCode,
            date,
            trip,
            value,
            tax,
            ref,
            depo,
            cashDeposited,
            chequeDeposited,
            remark
        });

        res.status(201).json({ message: "New Cash/Credit created sucessfully" });
    } catch (err) {
        res.status(500).json({ message: "Error creating cash/ credit", error: err.message });
    }
};

export const getAllCashCredits = async (req, res) => {
    try {
        const data = await CashCredit.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching records', error: error.message });
    }
};

export const getOneCashCredit = async (req, res) => {
    try {
        const { salesmanCode, trip, date, depo } = req.body;
        if (!date || !salesmanCode || !trip || !depo) return res.status(400).json({ message: "All fields are required" });
        if (!mongoose.Types.ObjectId.isValid(depo)) {
            return res.status(400).json({ message: "Invalid depo ID" });
        }

        const depoExists = await Depo.findById(depo);
        if (!depoExists) {
            return res.status(400).json({ message: "Depo not found" });
        }
        const data = await CashCredit.find({ salesmanCode, date, trip, depo });
        if (!data) return res.status(404).json({ message: "Cash/credit not found" });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching cash/credit', error: err.message });
    }
};

export const getCashCreditById = async (req, res) => {
    try {
        const data = await CashCredit.findById(req.params.id);
        if (!data) return res.staus(404).json({ message: "Record not found" });

        res.staus(200).json(data);

    } catch (err) {
        res.status(500).json({ message: "Error fetching cash credit by id", error: err.message });
    }
};

export const updateCashCredit = async (req, res) => {
    try {
        const updated = await CashCredit.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        });
        if (!updated) return res.status(404).json({ message: "Record not found" });
        res.status(200).json({ message: "Record updated sucessfully", data: updated });
    } catch (err) {
        res.status(500).json({ message: "Error updating records", error: err.message });
    }
};

export const deleteCashCredit = async (req, res) => {
    try {
        const deleted = CashCredit.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Record not found" });
        res.status(200).json({ message: "Record deleted sucessfully" });

    } catch (err) {
        res.status(500).json({ message: "Error deleting Record", error: err.message });
    }
};