import getMonthWiseGraph from "../services/monthWiseGraphService.js";

const monthWiseLineGraph = async (req, res) => {
    try {
        const { year } = req.body;

        const actualYear =
            year === "current"
                ? new Date().getFullYear()
                : new Date().getFullYear() - 1;
        const start = new Date(`${actualYear}-01-01`);
        const end = new Date(`${actualYear}-12-31`);
        const depo = req.user?.depo;
        const result = await getMonthWiseGraph({ start, end, depo });
        return res.status(200).json({
            success: true,
            ...result
        })
    } catch (err) {
        console.error("Linegraph error", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}
export default monthWiseLineGraph;