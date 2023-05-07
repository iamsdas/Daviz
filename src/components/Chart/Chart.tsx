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
import { Button } from '@material-tailwind/react';

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
  offset: number;
  range: number;
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
  const [chartData, setChartData] = useState<any>(initialData);
  const [p, setP] = useState<any>(null);
  const chartRef = useRef<any>(null);

  const chartFetchCB = ({ chart }: any) => {
    const { min, max } = chart.scales.x;
    if (min > 0 && max >= min) {
      setOffset(min);
      setRange(max - min + 1);
    }
  };

  const predictData = async () => {
    const data = chartData.datasets[0].data;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ series: data }),
    };
    const resp = await fetch(
      'http://localhost:8000/api/predict',
      requestOptions
    );
    const predictedData = await resp.json();
    const newData = Array(data.length).fill(null).concat(predictedData);
    const datasets = chartData.datasets.map((dataset: any) => {
      return {
        ...dataset,
        data: dataset.data.concat(Array(predictedData.length).fill(null)),
      };
    });
    datasets.push({
      data: newData,
      label: 'Predicted',
      borderColor: 'rgb(255,255,0)',
    });
    const labels = chartData.labels.concat(
      Array(predictedData.length).fill('')
    );
    setChartData({
      labels,
      datasets,
    });
  };

  useEffect(() => {
    if (file && yAxis && xAxis) {
      getChartData(file, yAxis, xAxis, groupBy, 0, numRows).then(
        ([data, time]) => {
          if (chartRef.current) {
            chartRef.current.resetZoom();
            chartRef.current.stop();
          }
          setP(time);
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
          setChartData(data);
        }
      );
    }
  }, [file, yAxis, xAxis, groupBy, numRows]);

  useEffect(() => {
    if (
      chartRef.current &&
      !isNaN(offset) &&
      !isNaN(range) &&
      chartType === 'Line'
    ) {
      console.log(chartRef.current);
      chartRef.current.options.scales.x.min = offset;
      chartRef.current.options.scales.x.max = offset + range - 1;
      chartRef.current.update();
    }
  }, [offset, range]);

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
      <Button
        color='blue-gray'
        onClick={() => {
          if (chartRef.current) {
            chartRef.current.resetZoom();
          }
          setOffset(0);
          setRange(numRows);
        }}>
        reset Zoom
      </Button>
      {chartType === 'Line' && (
        <Button color='orange' onClick={predictData} className='m-2'>
          Predict Data
        </Button>
      )}
      {/* {p && <p>{p}</p>} */}
    </>
  );
};

export default Chart;
