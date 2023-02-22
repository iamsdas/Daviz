const Analytics = ({ tables }: { tables: any[] }) => (
  <div className='grid h-[670px] grid-cols-2 gap-4 overflow-y-auto'>
    {tables.map((item) => (
      <table className='m-2 table-auto border-collapse bg-slate-50'>
        <thead className='border-2 border-green-400 p-1'>
          <th className=''>{item.name}</th>
        </thead>
        <tbody>
          {Object.keys(item)
            .filter((key) => key !== 'name')
            .map((key) => (
              <tr>
                <td className='border-2 border-green-400 p-1'>{key}</td>
                <td className='border-2 border-green-400 p-1'>{item[key]}</td>
              </tr>
            ))}
        </tbody>
      </table>
    ))}
  </div>
);

export default Analytics;
