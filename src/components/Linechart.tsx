import { Line } from 'react-chartjs-2';

export default function Linechart({ chartData }) {
  return (
    <div className='chart-container'>
      <h2 style={{ textAlign: 'center' }}>Line Chart</h2>
      <Line
        data={chartData}
        options={{
          // normalized: true,
          parsing: false,
          plugins: {
            decimation: {
              enabled: true,
            },
            title: {
              display: true,
              // text: "example caption",
            },
            legend: {
              position: 'top',
            },
            zoom: {
              pan: {
                enabled: true,
                mode: 'x',
                modifierKey: 'ctrl',
              },
              zoom: {
                drag: {
                  enabled: true,
                },
                pinch: {
                  enabled: true,
                },
                mode: 'x',
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
