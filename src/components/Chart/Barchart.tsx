import { Bar } from 'react-chartjs-2';
export default function BarChart({ chartData }: any) {
  return (
    <div className='aspect-[2/1]'>
      <Bar
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
                modifierKey: 'ctrl',
              },
              zoom: {
                drag: {
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
