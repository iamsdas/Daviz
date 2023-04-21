import React from 'react';
import { Pie } from 'react-chartjs-2';

function PieChart({ chartData }: any) {
  return (
    <div className='aspect-[2/1]'>
      <Pie
        // ref={chartRef}
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              // text: "example caption",
            },
            legend: {
              position: 'top',
            },
            // zoom: {
            //   pan: {
            //     enabled: true,
            //     mode: 'x',
            //     modifierKey: 'shift',
            //   },
            //   zoom: {
            //     drag: {
            //       enabled: true,
            //     },
            //     pinch: {
            //       enabled: true,
            //     },
            //     mode: 'x',
            //     onZoomComplete: chartFetchCB,
            //   },
            // },
          },
        }}
      />
    </div>
  );
}
export default PieChart;
