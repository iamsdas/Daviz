import { Bar } from "react-chartjs-2";
export default function BarChart({ chartData }) {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Bar Chart</h2>
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              // text: "example caption",
            },
            legend: {
              position: "top"
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
