import { useState } from 'react';
import Chart from './Chart';
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
import { openFile } from '../utils';

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
    { label: 'Line chart', value: 'Line' },
  ],
  Comparision: [
    { label: 'Line chart', value: 'Line' },
    { label: 'Scatter plot', value: 'Scatter' },
  ],
};

export default function Homepage() {
  const [file, setFile] = useState<string>('');

  const [userPurpose, setUserPurpose] = useState<UserPurpose>('Comparision');
  const [chartType, setChartType] = useState<ChartType>('Bar');
  const [columns, setColumns] = useState<string[]>([]);

  const [xAxis, setXAxis] = useState<string>();
  const [yAxis, setYAxes] = useState<string>();
  const [groupBy, setGroupBy] = useState<string>();

  const [rows, setRows] = useState<string[]>([]);
  const [minValue, setMinValue] = useState<string>('');
  const [maxValue, setMaxValue] = useState<string>('');

  const importData = () => {
    openFile().then(([fileName, columnsOfFile]) => {
      setFile(fileName);
      setColumns(columnsOfFile);
    });
  };

  const clearParams = () => {
    setXAxis(undefined);
    setYAxes(undefined);
    setGroupBy(undefined);
  };

  return (
    <div className=' w-full h-screen flex flex-row'>
      {/* left panel */}
      <div className=' w-1/5 bg-blue-gray-50 p-4 rounded-md h-full overflow-y-auto'>
        <h1 className=' text-left pl-5 font-bold font-mono text-3xl'>DaViz</h1>
        <div className=' text-center mx-auto my-16'>
          <div className=' space-y-6'>
            <Button className='w-full' onClick={() => importData()}>
              import dataset
            </Button>

            <Select
              label='Purpose'
              value={userPurpose}
              onChange={setUserPurpose as any}>
              {Object.keys(options).map((item, index) => (
                <Option value={item} key={index}>
                  {item}
                </Option>
              ))}
            </Select>

            <Select label='Select chart type' onChange={setChartType as any}>
              {options[userPurpose].map((item, index) => {
                return (
                  <Option value={item.value} key={index}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>

            {columns.length > 0 && (
              <>
                <Select
                  label='Choose the x-axis'
                  value={xAxis}
                  onChange={setXAxis}>
                  {columns.map((item, index) => (
                    <Option key={index} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>

                <Select
                  label='Choose the y-axis'
                  value={yAxis}
                  onChange={setYAxes}>
                  {columns.map((item) => (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>

                <Select label='Group by' value={groupBy} onChange={setGroupBy}>
                  {columns.map((item) => (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
                <Button
                  color='blue-gray'
                  onClick={clearParams}
                  className='w-full'>
                  Clear Params
                </Button>
              </>
            )}
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
                file={file}
                xAxis={xAxis}
                yAxis={yAxis}
                groupBy={groupBy}
                minValue={''}
                maxValue={''}
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
