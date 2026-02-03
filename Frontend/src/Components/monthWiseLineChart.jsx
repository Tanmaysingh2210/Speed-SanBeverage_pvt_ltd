import React , { useState , useEffect} from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import api from "../api/api";

const CustomTooltip = ({active , payload , label})=>{
    if(!active || !payload || !label) return null;

    const {qty}= payload[0].payload;

    return (
    <div
      style={{
        background: "#55586d",
        padding: "10px 12px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        fontSize: "0.85rem",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>
        Month: {label}
      </div>
      <div style={{ color: "#10b981", fontWeight: 600 }}>
        Qty Sold: {qty}
      </div>
    </div>
  );
}

const MonthWiseLineChart = ({year})=>{
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);

        const payload = { year };
        const res = await api.post("/graph/line/", payload);

        const { success, ...months } = res.data;

        const formatted = Object.entries(months).map(([month, qty]) => ({
          month,
          qty,
        }));

        setData(formatted);
      } catch (err) {
        console.error("line chart error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [year]);


  if (loading) return <p>Loading chart...</p>;
  if (!data.length) return <p>No data available</p>;

return (
    <ResponsiveContainer width="100%" height="100%">
      {loading && <div className="chart-overlay">Loading...</div>}

      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 10, bottom: 50 }}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="month"
          angle={-0}
          textAnchor="end"
          interval={0}
          tick={{ fontSize: 12 }}
        />

        <YAxis />

        <Tooltip
          cursor={{ stroke: "#10b981", strokeWidth: 1 }}
          content={<CustomTooltip />}
        />

        <Line
          type="monotone"
          dataKey="qty"
          stroke="#10b981"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MonthWiseLineChart;