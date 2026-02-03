import React, { useState } from 'react';
import ItemQtyBarChart from '../Components/ItemQtyBarChart';
import "./Statistics.css";
import MonthWiseLineChart from "../Components/monthWiseLineChart";


const Statistics = () => {
  const [year, setYear] = useState("current");
  const [month, setMonth] = useState("jan");
  const [yearForLineChart, setYearForLineChart] = useState("current");

  return (
    <div className="summary-page">
      <div className="summary-header">
        <h2>Sales Summary</h2>
        <p>Item-wise & trend analytics</p>
      </div>

      <div className="summary-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Item Wise Sale</h3>
            <div className="chart-filters">
              <select value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="current">Current Year</option>
                <option value="last">Last Year</option>
              </select>

              <select value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="jan">Jan</option>
                <option value="feb">Feb</option>
                <option value="mar">Mar</option>
                <option value="apr">Apr</option>
                <option value="may">May</option>
                <option value="jun">Jun</option>
                <option value="jul">Jul</option>
                <option value="aug">Aug</option>
                <option value="sep">Sep</option>
                <option value="oct">Oct</option>
                <option value="nov">Nov</option>
                <option value="dec">Dec</option>
              </select>
            </div>
          </div>
          <div className="chart-wrapper">
            <ItemQtyBarChart month={month} year={year} />
          </div>

        </div>


         {/* ================= Monthly Trend Line Chart ================= */}

          <div className="chart-card full-width">
          <div className="chart-header">
            <h3>Monthly Sale</h3>
            <div className="chart-filters">
              <select value={yearForLineChart} onChange={(e) => setYearForLineChart(e.target.value)}>
                <option value="current">Current Year</option>
                <option value="last">Last Year</option>
              </select>
            </div>
          </div>

          <div className="chart-wrapper">
            <MonthWiseLineChart year={yearForLineChart} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Item Wise Sales Value</h3>
          <div className="chart-wrapper">
            {/* <ItemQtyBarChart month="jan" year="current" /> */}
          </div>
        </div>
      </div>
    </div>

  )
}

export default Statistics;

