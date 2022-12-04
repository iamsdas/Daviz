import React, { useEffect, useState } from "react";
import axios from "axios";
import Linechart from "./Linechart";
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
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Homepage() {
  // const Data = [
  //   {
  //     id: 1,
  //     year: 2016,
  //     userGain: 80000,
  //     userLost: 823,
  //   },
  //   {
  //     id: 2,
  //     year: 2017,
  //     userGain: 45677,
  //     userLost: 345,
  //   },
  //   {
  //     id: 3,
  //     year: 2018,
  //     userGain: 78888,
  //     userLost: 555,
  //   },
  //   {
  //     id: 4,
  //     year: 2019,
  //     userGain: 90000,
  //     userLost: 4555,
  //   },
  //   {
  //     id: 5,
  //     year: 2020,
  //     userGain: 4300,
  //     userLost: 234,
  //   },
  // ];

  const options = {
    Composition: ["Pie chart", "Donought chart", "Stacked bar chart"],
    Distribution: ["Bar chart (Histogram)", "Line chart (Area)"],
    Trends: ["Coloumn char", "Area chart", "Line chart"],
    Comparision: ["Line chart", "Scatter plot"],
  };

  const [response, setResponse] = useState();
  const [chartType, setChartType] = useState("trends");
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

  var formData = new FormData();

  const SendData = async (e) => {
    e.preventDefault();

    formData.append("csv_file", file);
    formData.append("data_type", chartType);
    console.log(
      "FormData:",
      formData.getAll("file"),
      formData.getAll("chartType")
    );

    try {
      const res = await axios({
        method: "post",
        url: "https://daviz-backend-production.up.railway.app/api",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResponse(res.data);
      setChartData(res.data);
      console.log("Response:", res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" w-full h-full px-8 py-5">
      <h1 className=" text-center font-semibold text-2xl">DaViz</h1>
      <div className=" w-1/2 text-center mx-auto ">
        <form>
          <input
            type={"file"}
            id={"csvFileInput"}
            accept={".csv"}
            onChange={handleOnChange}
          />

          <button
            className=" bg-green-400 hover:brightness-105 px-1 py-2 rounded-md my-2"
            onClick={(e) => {
              handleOnSubmit(e);
            }}
          >
            IMPORT CSV
          </button>
          <br />
          <br />
          <label className="block mb-2 text-sm text-gray-900 dark:text-white font-semibold text-left">
            *Choose the purpose of Vizualization
          </label>
          <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value="comparision">Comparision</option>
            <option value="distribution">Distribution</option>
            <option value="composition">Composition</option>
            <option value="trends">Trends</option>
          </select>
          <br />
          <label className="block mb-2 text-sm text-gray-900 dark:text-white font-semibold text-left">
            *Choose the options from chart types
          </label>
          <select
            id="countries"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="comparision">Comparision</option>
            <option value="distribution">Distribution</option>
            <option value="composition">Composition</option>
            <option value="trends">Trends</option>
          </select>

          <button
            className=" bg-green-400 hover:brightness-105 px-1 py-2 rounded-md my-2"
            onClick={(e) => SendData(e)}
          >
            Send
          </button>
        </form>
      </div>

      <br />
      <div className=" flex flex-row justify-between mx-auto ">
        <div className=" w-1/2 text-center flex flex-col justify-around mr-5">
          <h1>Table</h1>
          <table className=" border-2 border-solid text-center px-2 ">
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
          </table>
        </div>

        <br />

        <div className=" w-1/2 ml-5">
          <h1>Chart</h1>
          <Linechart chartData={chartData} />
        </div>
      </div>
    </div>
  );
}
