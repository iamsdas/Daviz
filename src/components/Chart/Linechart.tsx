import { useRef } from 'react';
import { Line } from 'react-chartjs-2';

export default function Linechart({ chartData, chartFetchCB, chartRef }: any) {
  return (
    <div className='aspect-[2/1]'>
      <Line
        ref={chartRef}
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
                onZoomComplete: chartFetchCB,
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
