const {Salesman}=require('../../models/salesman.js')


exports.addSalesman = async (req, res) => {
    try {
        const { routeNo, name, codeNo } = req.body;

        if (!routeNo || !name || !codeNo)
            return res.status(400).json({ message: "routeNo, name, and codeNo are required" });

        const existing = await Salesman.findOne({ codeNo });
        if (existing)
            return res.status(400).json({ message: "Salesman with this codeNo already exists" });

        await Salesman.create({ routeNo, name, codeNo });

        res.status(200).json({ message: "Salesman added successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error adding salesman", error: err.message });
    }
};


exports.getAllSalesmen = async (req, res) => {
    try {
        const salesmen = await Salesman.find();
        res.status(200).json(salesmen);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching salesmen', error: error.message });
    }
};

exports.getSalesmanById = async (req, res) => {
    try {
        const salesman = await Salesman.findById(req.params.id);
        if (!salesman) return res.status(404).json({ message: 'Salesman not found' });
        res.status(200).json(salesman);
    } catch (err) {
        res.status(500).json({ message: "Error fetching salesman", error: err.message });
    }
};


exports.updateSalesman = async (req, res) => {
    try {
        const updated = await Salesman.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Salesman not found' });
        res.status(200).json({ message: 'Salesman updated successfully', updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating salesman', error: error.message });
    }
};

exports.deleteSalesman = async (req, res) => {
    try {
        const deleted = await Salesman.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Salesman not found" });
        res.status(200).json({ message: "Salesman deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting salesman", error: err.message });
    }
};
