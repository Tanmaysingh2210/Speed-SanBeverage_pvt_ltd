import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";
import api from "../api/api";

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const { itemCode, name, qty } = payload[0].payload;

    return (
        <div
            style={{
                background: "#55586d",
                padding: "10px 12px",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                fontSize: "0.85rem"
            }}
        >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>
                {itemCode.toUpperCase()}
            </div>
            <div style={{ color: "#a1adc6", marginBottom: 6 }}>
                {name}
            </div>
            <div style={{ color: "#10b981", fontWeight: 600 }}>
                Qty Sold: {qty}
            </div>
        </div>
    );
};

const ItemQtyBarChart = ({ year, month }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                setLoading(true);
                const payload = { year, month };
                const res = await api.post("/graph/bar/", payload);

                // IMPORTANT: match backend response
                setData(res.data.summary || []);
            } catch (err) {
                console.error("bar chart error", err);
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, [year, month]);

    if (loading) return <p>Loading chart...</p>;
    if (!data.length) return <p>No data available</p>;

    return (
        <ResponsiveContainer width="100%" height="100%">
            {loading && <div className="chart-overlay">Loading...</div>}
            <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 10, bottom: 70 }}
                barCategoryGap={20}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="itemCode"
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                    tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip
                    cursor={{ fill: "rgba(16, 185, 129, 0.15)" }}
                    content={<CustomTooltip />}
                />
                <Bar
                    dataKey="qty"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                    activeBar={{ fill: "#059669" }}
                />
            </BarChart>
        </ResponsiveContainer>

    );
};

export default ItemQtyBarChart;