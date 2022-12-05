import React, { useState } from "react";
import axios from "axios";
import Linechart from "./Linechart";
import { Chart, LogarithmicScale } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { FixedSizeList as List } from "react-window";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Select from "react-select";

const colors = [
  'rgb(255, 99, 132)',
  'rgb(255, 159, 64)',
  'rgb(255, 205, 86)',
   'rgb(75, 192, 192)',
  'rgb(54, 162, 235)',
  'rgb(153, 102, 255)',
   'rgb(201, 203, 207)'
];
  
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale
);
Chart.register(zoomPlugin);

export default function Homepage() {
  const options = {
    Composition: ["Pie chart", "Donought chart", "Stacked bar chart"],
    Distribution: ["Bar chart (Histogram)", "Line chart (Area)"],
    Trends: ["Coloumn char", "Area chart", "Line chart"],
    Comparision: ["Line chart", "Scatter plot"],
  };

  const [state, setState] = useState(0);
  const [response, setResponse] = useState();
  const [chartType, setChartType] = useState("");
  const [userChartType, setUserChartType] = useState("");
  const [userPurpose, setUserPurpose] = useState("comparision");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [file, setFile] = useState();
  const [array, setArray] = useState([]);

  const fileReader = new FileReader();

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const csvFileToArray = (string) => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map((i) => {
      const values = i.split(",");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });

    setArray(array);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
      };

      fileReader.readAsText(file);
    }
  };

  const headerKeys = Object.keys(Object.assign({}, ...array));
  const yAxisOptions = headerKeys.map((option) => ({
    value: option,
    label: option,
  }));

  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState<any>(null);

  console.log(headerKeys);

  const SendData = async (e) => {
    e.preventDefault();

    if (xAxis == "") setXAxis(headerKeys[0]);

    var formData = new FormData();

    formData.append("csv_file", file);
    formData.append("data_type", userPurpose);
    formData.append("x_axis", xAxis);
    formData.append("y_axes", yAxis.join(","));
    console.log(
      "FormData:",
      formData.getAll("csv_file"),
      formData.getAll("data_type"),
      formData.getAll("x_axis"),
      formData.getAll("y_axes")
    );

    try {
      const res = await axios({
        method: 'post',
        url: 'https://daviz-backend-production.up.railway.app/api',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResponse(res.data.data);
      setChartData(
         {
          ...res.data.data,
          datasets: [
            ...res.data.data.datasets.map((dataset, index) => ({
              ...dataset,
              borderColor: colors[index % colors.length],
            })),
          ],
        }
      );
      console.log('Response:', res);
    } catch (error) {
      console.log(error);
    }

    setState(1);
  };

  const Header = ({ key, style }) => (
    <div key={key} style={style}>
      {headerKeys.map((key) => (
        <th className=" border-2 border-solid text-center px-2 w-32 ">{key}</th>
      ))}
    </div>
  );

  const Row = ({ index, style }) => (
    <div>
      <tr key={index} style={style}>
        {Object.values(array[index]).map((val) => (
          <td className=" border-2 border-solid text-center px-2 w-32 ">
            {val}
          </td>
        ))}
      </tr>
    </div>
  );

  const userTable = (
    <div className=" w-11/12 text-center mr-5 h-[700px] overflow-y-auto flex justify-center text-center">
      <div className="overflow-y-scroll snap snap-y snap-mandatory flex flex-col flex-wrap hide-scroll-bar justify-around">
        <h1 className=" font-semibold">Table</h1>
        <List width={800} height={30} itemCount={1} itemSize={50}>
          {Header}
        </List>
        <List width={800} height={600} itemCount={array.length} itemSize={50}>
          {Row}
        </List>
        {/* <table className=" border-2 border-solid text-center px-2 ">
          <thead className=" border-2 border-solid text-center px-2 ">
            <tr key={"header"}>
              {headerKeys.map((key) => (
                <th className=" border-2 border-solid text-center px-2 ">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className=" border-2 border-solid text-center px-2 ">
            {array.map((item) => (
              <tr key={item.id}>
                {Object.values(item).map((val) => (
                  <td className=" border-2 border-solid text-center px-2 ">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table> */}
      </div>
    </div>
  );

  const userChart = (
    <div className=" w-10/12">
      <div className=" flex flex-row justify-between">
        <div>
          <h1 className=" font-semibold text-lg">{userPurpose}</h1>
        </div>
        <div>
          <button className=" bg-green-400 hover:brightness-105 p-1 rounded-full mx-1 my-2 text-xs font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <button className=" bg-green-400 hover:brightness-105 p-1 mx-1 rounded-full my-2 text-xs hover:scale-105 font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        </div>
      </div>
      <Linechart chartData={chartData} />
    </div>
  );

  const calculations = (
    <div>
      <h1>show calculations</h1>
    </div>
  );

  const Component = [
    {
      name: "Table",
      value: userTable,
    },
    {
      name: "Chart",
      value: userChart,
    },
    {
      name: "Calculations",
      value: calculations,
    },
  ];

  return (
    <div className=" w-full h-full px-8 py-5 flex flex-row">
      <div className=" w-4/12 bg-slate-50 p-2 rounded-md h-[780px]">
        <h1 className=" text-left pl-5 font-bold font-mono text-3xl">DaViz</h1>
        <div className=" text-center mx-auto my-16 ">
          <form>
            <input
              type={"file"}
              id={"csvFileInput"}
              accept={".csv"}
              onChange={handleOnChange}
            />

            <button
              className=" bg-green-400 hover:brightness-105 px-2 py-1 font-mono font-semibold text-xs rounded-md hover:scale-105"
              onClick={(e) => {
                handleOnSubmit(e);
              }}
            >
              IMPORT CSV
            </button>
            <br />

            <br />
            <label className="block mb-2 pt-2 text-sm text-gray-900 dark:text-white font-semibold text-left">
              *Choose the purpose of Vizualization
            </label>
            <select
              onChange={(e) => setUserPurpose(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="comparision">Comparision</option>
              <option value="distribution">Distribution</option>
              <option value="composition">Composition</option>
              <option value="trends">Trends</option>
            </select>

            <br />
            <label className="block mb-2 pt-2 text-sm text-gray-900 dark:text-white font-semibold text-left">
              *Choose the options from chart types
            </label>
            <select
              onChange={(e) => setUserChartType(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              {
                {
                  composition: options.Composition.map((item, index) => {
                    return (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    );
                  }),
                  distribution: options.Distribution.map((item, index) => {
                    return (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    );
                  }),
                  comparision: options.Comparision.map((item, index) => {
                    return (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    );
                  }),
                  trends: options.Trends.map((item, index) => {
                    return (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    );
                  }),
                }[userPurpose]
              }
            </select>

            <br />
            <label className="block mb-2 pt-2 text-sm text-gray-900 dark:text-white font-semibold text-left">
              * Choose the x-axis
            </label>
            <select
              onChange={(e) => setXAxis(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              {headerKeys.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <br />
            <label className="block mb-2 pt-2 text-sm text-gray-900 dark:text-white font-semibold text-left">
              * Choose the y-axis
            </label>
            <Select
              options={yAxisOptions}
              onChange={(e) =>
                setYAxis(Array.isArray(e) ? e.map((hotel) => hotel.label) : [])
              }
              isMulti
            />

            <button
              className=" bg-green-400 hover:brightness-105 my-8 py-1 px-2 font-mono font-semibold text-sm rounded-md hover:scale-105"
              onClick={(e) => SendData(e)}
            >
              Send
            </button>
          </form>
        </div>
      </div>

      <div className=" w-8/12 flex flex-col h-full mx-auto items-start">
        <div className="flex flex-row justify-around flex-nowrap bg-grey w-2/3 mx-auto border-2 border-solid h-14 bg-slate-50 ">
          {Component.map((value, index) => {
            return (
              <div key={index}>
                <button
                  className="px-2 mx-5 py-1 hover:brightness-105 bg-slate-50 hover:bg-slate-50 hover:border-2 hover:rounded-lg rounded-sm m-2 font-semibold hover:scale-105"
                  onClick={() => setState(index)}
                >
                  {value.name}
                </button>
              </div>
            );
          })}
        </div>
        <div className=" w-full py-5 flex justify-around">
          {Component[state].value}
        </div>
      </div>
    </div>
  );
}
