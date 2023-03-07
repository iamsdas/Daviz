import { useEffect, useState } from 'react';
import { FixedSizeGrid as List } from 'react-window';
import { getChartData, getTableData } from '../utils';

interface Props {
  file: string;
  offset?: number;
  range?: number;
  yAxis?: string;
  xAxis?: string;
  groupBy?: string;
}

const Table = ({ file, offset, range, yAxis, xAxis, groupBy }: Props) => {
  const [tableData, setTableData] = useState<any>({});
  useEffect(() => {
    if (file && yAxis && xAxis) {
      getTableData(file, xAxis, yAxis, groupBy, offset, range).then((data) => {
        setTableData(data);
      });
    }
  }, [file, yAxis, xAxis, groupBy, offset, range]);

  const Cell = ({ columnIndex, rowIndex, style }: any) => (
    <div
      style={style}
      className={`truncate border-r border-b  ${
        rowIndex === 0 ? 'capitalize font-bold' : ''
      }`}>
      {tableData[rowIndex][columnIndex]}
    </div>
  );

  return (
    <div className=' w-full h-full flex justify-center text-center'>
      <div className='overflow-y-scroll snap snap-y snap-mandatory flex flex-col flex-wrap hide-scroll-bar justify-around'>
        <h1 className=' font-semibold'>Table</h1>
        <table>
          <List
            columnCount={tableData?.[0]?.length || 0}
            columnWidth={120}
            height={800}
            rowCount={tableData?.length || 0}
            rowHeight={35}
            width={800}>
            {Cell}
          </List>
        </table>
      </div>
    </div>
  );
};

export default Table;
