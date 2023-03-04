import { Line } from 'react-chartjs-2';

export default function Linechart({ chartData }: any) {
  return (
    <div className='aspect-[2/1]'>
      <Line
        data={chartData}
        options={{
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
                modifierKey: 'shift',
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
