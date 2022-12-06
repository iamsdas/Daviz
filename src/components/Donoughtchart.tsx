import { Doughnut } from "react-chartjs-2";

export default function Donoughtchart({ chartData }) {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Donought Chart</h2>
      <Doughnut
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              // text: "example caption",
            },
            legend: {
              position: "top",
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
          // scales: {
          //   x: {
          //     display: true,
          //   },
          //   y: {
          //     display: true,
          //     type: "logarithmic",
          //   },
          // },
        }}
      />
    </div>
  );
}
