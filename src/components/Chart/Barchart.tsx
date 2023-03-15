import { Bar } from 'react-chartjs-2';
export default function BarChart({ chartData, chartFetchCB, chartRef }: any) {
  return (
    <div className='aspect-[2/1]'>
      <Bar
        ref={chartRef}
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
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
        }}
      />
    </div>
  );
}
