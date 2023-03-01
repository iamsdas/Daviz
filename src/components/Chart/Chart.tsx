import Linechart from './Linechart';
import Barchart from './Barchart';
import Scatterchart from './Scatterchart';
import Donoughtchart from './Donoughtchart';
import Piechart from './Piechart';
import zoomPlugin from 'chartjs-plugin-zoom';
import { memo, useEffect, useState } from 'react';
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
import { getChartData } from '../../utils';

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
  yAxis?: string;
  xAxis?: string;
  groupBy?: string;
}

const initialData = {
  labels: [],
  datasets: [
    {
      data: [],
    },
  ],
};

const Chart = ({ file, yAxis, xAxis, groupBy, chartType }: Props) => {
  const [chartData, setChartData] = useState(initialData);

  useEffect(() => {
    if (file && yAxis && xAxis) {
      getChartData(file, yAxis, xAxis, groupBy).then((data) => {
        setChartData(data);
      });
    }
  }, [file, yAxis, xAxis, groupBy]);

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

export default Chart;
