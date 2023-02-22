import { FixedSizeList as List } from 'react-window';

interface Props {
  headerKeys: string[];
  rows: any[];
}

const Table = ({ headerKeys, rows }: Props) => {
  const Header = ({ key, style }: any) => (
    <th key={key} style={style}>
      {headerKeys.map((key) => (
        <td className=' border-2 border-solid text-center px-2 w-32 '>{key}</td>
      ))}
    </th>
  );

  const Row = ({ index, style }: any) => (
    <tr key={index} style={style}>
      {Object.values(rows[index]).map((val) => (
        <td className=' border-2 border-solid text-center px-2 w-32 '>
          {val as string}
        </td>
      ))}
    </tr>
  );

  return (
    <div className=' w-11/12 mr-5 h-[700px] overflow-y-auto flex justify-center text-center'>
      <div className='overflow-y-scroll snap snap-y snap-mandatory flex flex-col flex-wrap hide-scroll-bar justify-around'>
        <h1 className=' font-semibold'>Table</h1>
        <table>
          <List width={800} height={30} itemCount={1} itemSize={50}>
            {Header}
          </List>
          <List width={800} height={600} itemCount={rows.length} itemSize={50}>
            {Row}
          </List>
        </table>
      </div>
    </div>
  );
};

export default Table;
