import React from "react";
import { Pie } from "react-chartjs-2";

function PieChart({ chartData }) {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Pie Chart</h2>
      <Pie
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              // text: "example caption",
            },
            legend: {
              display: false,
            },
            zoom: {
              pan: {
                enabled: true,
                mode: "x",
                modifierKey: "ctrl",
              },
              zoom: {
                drag: {
                  enabled: true,
                },
                pinch: {
                  enabled: true,
                },
                mode: "x",
              },
            },
          },
        }}
      />
    </div>
  );
}
export default PieChart;
