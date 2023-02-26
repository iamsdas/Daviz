import { useState } from 'react';
import Chart from './Chart';
import MultiSelect from 'react-select';
import {
  Button,
  Select,
  Option,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from '@material-tailwind/react';

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
      <div className=' w-1/5 bg-blue-gray-50 p-4 rounded-md h-full overflow-y-auto'>
        <h1 className=' text-left pl-5 font-bold font-mono text-3xl'>DaViz</h1>
        <div className=' text-center mx-auto my-16 '>
          <div>
            <Button className='w-full'>import</Button>
            <br />

            <br />

            <Select
              label='Purpose'
              value={userPurpose}
              onChange={(e) => {
                setUserPurpose(e as UserPurpose);
              }}>
              <Option value='Comparision'>Comparision</Option>
              <Option value='Distribution'>Distribution</Option>
              <Option value='Composition'>Composition</Option>
              <Option value='Trends'>Trends</Option>
            </Select>

            <br />
            <Select
              label='Select chart type'
              onChange={(e) => setChartType(e as ChartType)}>
              {
                {
                  Composition: options.Composition.map((item, index) => {
                    return (
                      <Option value={item.value} key={index}>
                        {item.label}
                      </Option>
                    );
                  }),
                  Distribution: options.Distribution.map((item, index) => {
                    return (
                      <Option value={item.value} key={index}>
                        {item.label}
                      </Option>
                    );
                  }),
                  Comparision: options.Comparision.map((item, index) => {
                    return (
                      <Option value={item.value} key={index}>
                        {item.label}
                      </Option>
                    );
                  }),
                  Trends: options.Trends.map((item, index) => {
                    return (
                      <Option value={item.value} key={index}>
                        {item.label}
                      </Option>
                    );
                  }),
                }[userPurpose]
              }
            </Select>

            <br />
            <Select label='Choose the x-axis'>
              {columns.map((item, index) => (
                <Option key={index} value={item}>
                  {item}
                </Option>
              ))}
            </Select>

            <br />

            <MultiSelect
              options={columns}
              className='!rounded-sm border-gray-200'
              onChange={(e) =>
                setYAxes(Array.isArray(e) ? e.map((hotel) => hotel.label) : [])
              }
              isMulti
            />

            <br />
            <label className='block mb-2 pt-2 text-sm text-gray-900 font-semibold text-left'>
              Choose the identifier (optional)
            </label>
            <Select label='Group by' onChange={(e) => setGroupBy(e)}>
              {columns.map((item, index) => (
                <Option key={index} value={item}>
                  {item}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* center panel */}
      <div className='p-4 w-3/5 h-screen'>
        <Tabs value='chart'>
          <TabsHeader className='content-center'>
            <Tab value='chart'>chart</Tab>
            <Tab value='table'>table</Tab>
          </TabsHeader>
          <TabsBody>
            <TabPanel value={'chart'}>
              <Chart
                chartData={{
                  labels: [],
                  datasets: [
                    {
                      data: [],
                    },
                  ],
                }}
                chartType={chartType}
              />
            </TabPanel>
            <TabPanel value={'table'}>
              <div>table</div>
            </TabPanel>
          </TabsBody>
        </Tabs>
      </div>

      {/* right panel */}
      <div className='w-1/5 bg-blue-gray-50 h-full overflow-y-scroll p-4'></div>
    </div>
  );
}
