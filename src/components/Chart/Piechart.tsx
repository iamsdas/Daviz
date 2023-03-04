import React from 'react';
import { Pie } from 'react-chartjs-2';

function PieChart({ chartData }: any) {
  return (
    <div className='aspect-[2/1]'>
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
        }}
      />
    </div>
  );
}
export default PieChart;
