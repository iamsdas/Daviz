import { useState } from 'react';
import Chart from './Chart';
import Select from 'react-select';

const colors = [
  'rgb(255, 99, 132)',
  'rgb(255, 159, 64)',
  'rgb(255, 205, 86)',
  'rgb(75, 192, 192)',
  'rgb(54, 162, 235)',
  'rgb(153, 102, 255)',
  'rgb(201, 203, 207)',
];

const options = {
  Composition: [
    { label: 'Pie chart', value: 'Pie' },
    { label: 'Doughnut chart', value: 'Doughnut' },
  ],
  Distribution: [
    { label: 'Bar chart (Histogram)', value: 'Bar' },
    { label: 'Line chart (Area)', value: 'Line' },
  ],
  Trends: [
    { label: 'Coloumn char', value: 'Bar' },
    { label: 'Area chart', value: 'Line' },
    { label: 'Line chart', value: 'Line' },
  ],
  Comparision: [
    { label: 'Line chart', value: 'Line' },
    { label: 'Scatter plot', value: 'Scatter' },
  ],
};

export default function Homepage() {
  const [userPurpose, setUserPurpose] = useState<UserPurpose>('Comparision');
  const [chartType, setChartType] = useState<ChartType>('Bar');
  const [columns, setColumns] = useState<string[]>([]);
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxes, setYAxes] = useState<string[]>([]);
  const [groupBy, setGroupBy] = useState<string>('');

  return (
    <div className=' w-full h-screen flex flex-row'>
      {/* left panel */}
      <div className=' w-1/5 bg-slate-50 p-4 rounded-md h-full overflow-y-scroll'>
        <h1 className=' text-left pl-5 font-bold font-mono text-3xl'>DaViz</h1>
        <div className=' text-center mx-auto my-16 '>
          <form>
            <button
              className=' bg-green-400 hover:brightness-105 px-2 py-1 font-mono font-semibold text-xs rounded-md hover:scale-105'
              onClick={(e) => {
                // handleOnSubmit(e);
              }}>
              IMPORT CSV
            </button>
            <br />

            <br />
            <label className='block mb-2 pt-2 text-sm text-gray-900 font-semibold text-left'>
              *Choose the purpose of Vizualization
            </label>
            <select
              onChange={(e) => setUserPurpose(e.target.value as UserPurpose)}
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
              <option value='comparision'>Comparision</option>
              <option value='distribution'>Distribution</option>
              <option value='composition'>Composition</option>
              <option value='trends'>Trends</option>
            </select>

            <br />
            <label className='block mb-2 pt-2 text-sm text-gray-900 font-semibold text-left'>
              *Choose the options from chart types
            </label>
            <select
              onChange={(e) => setChartType(e.target.value as ChartType)}
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
              {
                {
                  Composition: options.Composition.map((item, index) => {
                    return (
                      <option value={item.value} key={index}>
                        {item.label}
                      </option>
                    );
                  }),
                  Distribution: options.Distribution.map((item, index) => {
                    return (
                      <option value={item.value} key={index}>
                        {item.label}
                      </option>
                    );
                  }),
                  Comparision: options.Comparision.map((item, index) => {
                    return (
                      <option value={item.value} key={index}>
                        {item.label}
                      </option>
                    );
                  }),
                  Trends: options.Trends.map((item, index) => {
                    return (
                      <option value={item.value} key={index}>
                        {item.label}
                      </option>
                    );
                  }),
                }[userPurpose]
              }
            </select>

            <br />
            <label className='block mb-2 pt-2 text-sm text-gray-900 font-semibold text-left'>
              * Choose the x-axis
            </label>
            <select
              onChange={(e) => setXAxis(e.target.value)}
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
              {columns.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <br />
            <label className='block mb-2 pt-2 text-sm text-gray-900 font-semibold text-left'>
              * Choose the y-axis
            </label>
            <Select
              options={columns}
              onChange={(e) =>
                setYAxes(Array.isArray(e) ? e.map((hotel) => hotel.label) : [])
              }
              isMulti
            />

            <br />
            <label className='block mb-2 pt-2 text-sm text-gray-900 font-semibold text-left'>
              Choose the identifier (optional)
            </label>
            <select
              onChange={(e) => setGroupBy(e.target.value)}
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '>
              <option>select...</option>
              {columns.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button className=' bg-green-400 hover:brightness-105 my-8 py-1 px-2 font-mono font-semibold text-sm rounded-md hover:scale-105'>
              Send
            </button>
          </form>
        </div>
      </div>

      {/* center panel */}
      <div className='px-4 w-3/5 flex flex-col h-full items-start'>
        <div className='flex flex-row justify-around flex-nowrap bg-grey w-4/5 mx-auto border-2 border-solid h-14 bg-slate-50 '></div>
        <Chart
          chartData={{
            labels: [],
            datasets: [
              {
                data: [],
              },
            ],
          }}
          chartType={chartType}></Chart>
        <div className='flex flex-row justify-around gap-3 flex-nowrap bg-grey w-4/5 mx-auto border-2 border-solid h-20 bg-slate-50 p-3'>
          <select
            onChange={(e) => setXAxis(e.target.value)}
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2'>
            <option disabled={true} value='' selected={true}>
              min value
            </option>
            {columns.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => setXAxis(e.target.value)}
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2'>
            <option disabled={true} value='' selected={true}>
              max value
            </option>
            {columns.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* right panel */}
      <div className='w-1/5 bg-slate-50 h-full overflow-y-scroll p-4'></div>
    </div>
  );
}
