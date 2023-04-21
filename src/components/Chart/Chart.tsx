import Linechart from './Linechart';
import Barchart from './Barchart';
import Scatterchart from './Scatterchart';
import Donoughtchart from './Donoughtchart';
import Piechart from './Piechart';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useEffect, useRef, useState } from 'react';
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
import { colors, getChartData } from '../../utils';

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
  setOffset: (offset: number) => void;
  setRange: (range: number) => void;
  numRows: number;
  offset?: number;
  range?: number;
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

const Chart = ({
  file,
  yAxis,
  xAxis,
  groupBy,
  chartType,
  offset,
  range,
  numRows,
  setOffset,
  setRange,
}: Props) => {
  const [chartData, setChartData] = useState(initialData);
  const chartRef = useRef<any>(null);

  const chartFetchCB = ({ chart }: any) => {
    const { min, max } = chart.scales.x;
    if (min > 0 && max >= min) {
      setOffset(min);
      setRange(max - min + 1);
    }
  };

  useEffect(() => {
    if (file && yAxis && xAxis) {
      getChartData(file, yAxis, xAxis, groupBy, offset, range).then((data) => {
        if (chartRef.current) {
          chartRef.current.resetZoom();
          chartRef.current.stop();
        }
        if (
          chartType === 'Pie' ||
          chartType === 'Donought'
          // chartType === 'Bar'
        ) {
          data.datasets.forEach((dataset: any) => {
            dataset.backgroundColor = (dataset.data as any[]).map(
              (_, index) => colors[index % colors.length]
            );
          });
        }
        console.log('cd', data);
        setChartData(data);
      });
    }
  }, [file, yAxis, xAxis, groupBy, offset, range]);

  const chartTypesObj = {
    Line: (
      <Linechart
        chartData={chartData}
        chartFetchCB={chartFetchCB}
        chartRef={chartRef}
      />
    ),
    Bar: (
      <Barchart
        chartData={chartData}
        chartFetchCB={chartFetchCB}
        chartRef={chartRef}
      />
    ),
    Donought: <Donoughtchart chartData={chartData} />,
    Pie: <Piechart chartData={chartData} />,
    Scatter: (
      <Scatterchart
        chartData={chartData}
        chartFetchCB={chartFetchCB}
        chartRef={chartRef}
      />
    ),
  };

  return (
    <>
      <div className='w-full'>{(chartTypesObj as any)[chartType] || null}</div>
      <button
        onClick={() => {
          console.log(chartRef);
          if (chartRef.current) {
            chartRef.current.resetZoom();
          }
          setOffset(0);
          setRange(numRows);
        }}>
        resetZoom
      </button>
    </>
  );
};

export default Chart;
