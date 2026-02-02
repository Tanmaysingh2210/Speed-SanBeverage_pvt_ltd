import itemwiseGraph from "../services/itemwiseGraphService.js";

const monthMap = {
    jan: 0, feb: 1, mar: 2, apr: 3,
    may: 4, jun: 5, jul: 6, aug: 7,
    sep: 8, oct: 9, nov: 10, dec: 11
};

const getDateRange = (yearType, month) => {
    const now = new Date();
    const year =
        yearType === "last"
            ? now.getFullYear() - 1
            : now.getFullYear();

    const monthIndex = monthMap[month.toLowerCase()];
    if (monthIndex === undefined) {
        throw new Error("Invalid month");
    }

    const start = new Date(year, monthIndex, 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(year, monthIndex + 1, 0);
    end.setHours(23, 59, 59, 999);

    return { start, end };
};

const itemwiseBarGraph = async (req, res) => {
    try {
        const { year, month } = req.body;

        if (!year || !month) return res.status(400).json({ message: "Year and month are required" });
        const depo = req.user?.depo;
        const { start, end } = getDateRange(year, month);

        const result = await itemwiseGraph({ start, end, depo });
        return res.status(200).json({
            success: true,
            ...result
        })
    } catch (err) {
        console.error("Bargraph error", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export default itemwiseBarGraph;