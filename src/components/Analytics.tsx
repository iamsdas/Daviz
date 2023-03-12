import { useEffect, useState } from 'react';
import { getAnalyticsData } from '../utils';

interface Props {
  file: string;
  offset?: number;
  range?: number;
  yAxis?: string;
  xAxis?: string;
  groupBy?: string;
}

const Analytics = ({ file, offset, range, yAxis, xAxis, groupBy }: Props) => {
  const [tables, setTables] = useState<any[]>();
  useEffect(() => {
    if (file && xAxis) {
      getAnalyticsData(file, xAxis, yAxis, groupBy, offset, range).then(
        (data) => {
          console.log(data);
          setTables(data);
        }
      );
    }
  }, [file, yAxis, xAxis, groupBy, offset, range]);

  return (
    <div className='space-y-8 flex flex-col items-stretch'>
      {tables &&
        tables.map(({ name, data }) => (
          <table className='m-2 table-auto border-collapse bg-slate-50 rounded-xl'>
            <thead className='border border-gray-400 p-1'>
              <th colSpan={2}>{name}</th>
            </thead>
            <tbody>
              {data &&
                data.map((column: any) => (
                  <tr>
                    <td className='border border-gray-400 p-1'>
                      {column.name}
                    </td>
                    <td className='border border-gray-400 p-1'>
                      {column.data}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        ))}
    </div>
  );
};

export default Analytics;
