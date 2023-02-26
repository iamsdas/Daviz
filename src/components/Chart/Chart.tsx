import Linechart from './Linechart';
import Barchart from './Barchart';
import Scatterchart from './Scatterchart';
import Donoughtchart from './Donoughtchart';
import Piechart from './Piechart';
import zoomPlugin from 'chartjs-plugin-zoom';
import { memo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Decimation,
  ArcElement,
  BarElement,
  LogarithmicScale,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Decimation,
  LogarithmicScale,
  ArcElement,
  BarElement,
  zoomPlugin
);

interface Props {
  file: string;
  chartType: string;
  minValue: string;
  maxValue: string;
  yAxis: string;
  xAxis: string;
  groupBy: string | null;
}

const chartData = {
  labels: [],
  datasets: [
    {
      data: [],
    },
  ],
};

const Chart = ({ chartType }: Props) => {
  const chartTypesObj = {
    Line: <Linechart chartData={chartData} />,
    Bar: <Barchart chartData={chartData} />,
    Donought: <Donoughtchart chartData={chartData} />,
    Pie: <Piechart chartData={chartData} />,
    Scatter: <Scatterchart chartData={chartData} />,
  };

  return (
    <div className='w-full flex-grow align-middle my-5'>
      {(chartTypesObj as any)[chartType] || null}
    </div>
  );
};

export default memo(Chart);
