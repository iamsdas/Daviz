import { open } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';

export async function openFile(): Promise<[string, string[]]> {
  const fileName = await open({
    multiple: false,
    filters: [{ name: 'csv', extensions: ['csv'] }],
  });

  const columns: string[] = await invoke('get_columns', { fileName });

  return [fileName as string, columns];
}

const colors = [
  'rgb(255, 99, 132)',
  'rgb(255, 159, 64)',
  'rgb(255, 205, 86)',
  'rgb(75, 192, 192)',
  'rgb(54, 162, 235)',
  'rgb(153, 102, 255)',
  'rgb(201, 203, 207)',
];

export async function getChartData(
  fileName: string,
  yAxis: string,
  xAxis: string,
  groupBy?: string,
  offset?: number,
  range?: number
): Promise<any> {
  const data: string = await invoke('get_data_for_chart', {
    fileName,
    yAxis,
    xAxis,
    groupBy,
    offset,
    range,
  });
  const res = JSON.parse(data);
  const chartData = {
    labels: res.columns.find((c: any) => c.name === 'x_axis').values,
    datasets: res.columns
      .filter((c: any) => c.name !== 'x_axis')
      .map((c: any, index: number) => ({
        label: c.name,
        data: c.values,
        borderColor: colors[index % colors.length],
      })),
  };
  return chartData;
}

export async function getTableData(
  fileName: string,
  xAxis: string,
  yAxis?: string,
  groupBy?: string,
  offset?: number,
  range?: number
): Promise<any[][]> {
  const data: string = await invoke('get_data_for_table', {
    fileName,
    yAxis,
    xAxis,
    groupBy,
    offset,
    range,
  });
  const res = JSON.parse(data);
  const tableData: any[] = [];
  const columns: any[] = [];
  res.columns.forEach((c: any) => {
    columns.push(c.name);
    tableData[c.name] = c.values;
  });
  tableData.push(columns);
  if (columns.length > 0) {
    for (let i = 0; i < tableData[columns[0]].length; i++) {
      const row: any[] = [];
      columns.forEach((c: any) => {
        row.push(tableData[c][i]);
      });
      tableData.push(row);
    }
  }
  return tableData;
}

export async function getAnalyticsData(
  fileName: string,
  xAxis: string,
  yAxis?: string,
  groupBy?: string,
  offset?: number,
  range?: number
): Promise<any[]> {
  const data: any[] = await invoke('get_data_for_analytics', {
    fileName,
    yAxis,
    xAxis,
    groupBy,
    offset,
    range,
  });
  const res: any = [];
  data.forEach(([column, json]) => {
    const data = JSON.parse(json);
    const curr: any = {};
    curr['name'] = column;
    curr['data'] = data.columns
      .map((c: any) => {
        return {
          name: c.name,
          data: c.values[0],
        };
      })
      .filter((c: any) => c.data !== null);
    res.push(curr);
  });
  return res;
}

export async function getXAxis(
  fileName: string,
  column: string
): Promise<string[]> {
  return await invoke('get_rows', { fileName, column });
}
