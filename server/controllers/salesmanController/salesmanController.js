import Salesman from '../../models/salesman.js';


export const addSalesman = async (req, res) => {
    try {
        const { routeNo, name, codeNo, status } = req.body;

        const depo = req.user?.depo;

        const existing = await Salesman.findOne({ codeNo, depo });

        if (existing)
            return res.status(400).json({ message: "Salesman with this codeNo already exists" });

        await Salesman.create({ routeNo, name, codeNo, depo, status: status || 'Active' });

        res.status(200).json({ message: "Salesman added successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error adding salesman", error: err.message });
        console.log("error data", err.message);
        console.log("Error", err);

    }
};


export const getAllSalesmen = async (req, res) => {
    try {

        const salesmen = await Salesman.find({ depo: req.user?.depo });
        res.status(200).json(salesmen);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching salesmen', error: error.message });
    }
};

export const getSalesmanById = async (req, res) => {
    try {
        const salesman = await Salesman.findOne({ _id: req.params.id, depo: req.user?.depo });
        if (!salesman) return res.status(404).json({ message: 'Salesman not found' });
        res.status(200).json(salesman);
    } catch (err) {
        res.status(500).json({ message: "Error fetching salesman", error: err.message });
    }
};


export const updateSalesman = async (req, res) => {
    try {
        const updated = await Salesman.findOneAndUpdate(
            { _id: req.params.id, depo: req.user?.depo },
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Salesman not found' });
        res.status(200).json({ message: 'Salesman updated successfully', updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating salesman', error: error.message });
    }
};

export const deleteSalesman = async (req, res) => {
    try {
        const deleted = await Salesman.findOneAndDelete({ _id: req.params.id, depo: req.user?.depo });
        if (!deleted) return res.status(404).json({ message: "Salesman not found" });
        res.status(200).json({ message: "Salesman deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting salesman", error: err.message });
    }
};
