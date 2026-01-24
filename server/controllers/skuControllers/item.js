const { Item } = require('../../models/SKU');
const Depo = require('../../models/depoModal');

exports.addItem = async (req, res) => {
    try {
        const { code, name, container, package, flavour, depo, status } = req.body;

        if (!code || !name || !container || !package || !flavour || !depo) return res.status(400).json({ message: "Every field is required" });

        if (!mongoose.Types.ObjectId.isValid(depo)) {
            return res.status(400).json({ message: "Invalid depo ID" });
        }

        // 3️⃣ Check if depo exists
        const depoExists = await Depo.findById(depo);
        if (!depoExists) {
            return res.status(400).json({ message: "Depo not found" });
        }

        const existing = await Item.findOne({ code });

        if (existing) return res.status(400).json({ message: "this item already exists try adding different one" });

        const created = await Item.create({
            code,
            name,
            container,
            package,
            flavour,
            depo,
            status: status || 'Active'
        });

        res.status(200).json({ message: "item added successfully", item: created });
    } catch (err) {
        res.status(500).json({ message: "Error adding item", error: err.message });
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const { depo } = req.body;
        if (!depo) return res.status(400).json({ message: "Depo is required" });

        if (!mongoose.Types.ObjectId.isValid(depo)) {
            return res.status(400).json({ message: "Invalid depo ID" });
        }

        const depoExists = await Depo.findById(depo);
        if (!depoExists) {
            return res.status(400).json({ message: "Depo not found" });
        }
        const items = await Item.find({depo});
        res.status(200).json(items);

    } catch (err) {
        res.staus(500).json({ message: "Error fetching items", error: err.message });
    }
};

exports.getItembyId = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Not found!" });
        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ message: "Error fetching item", errro: err.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const updated = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: "Item updated sucessfully", updated });
    } catch (err) {
        res.status(500).json({ message: "Error updating Item", error: err.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const deleted = await Item.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Item not found" });
        res.status(200).json({ message: "Item deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting item", error: err.message });
    }
};
