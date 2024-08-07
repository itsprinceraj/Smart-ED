import React, { useState } from "react";
import { Chart, registerables } from "chart.js";
import { Pie } from "react-chartjs-2";

Chart.register(...registerables); // register all modules from Chart
// Chart.defaults.font.size = 16;

export const StatisticChart = ({ courses }) => {
  //  set a current chart state
  const [currChart, setCurrChart] = useState("students");

  //   create a generate random color function , that will generate random colors as per input
  const generateRandomColors = (colorVal) => {
    const colors = [];

    //  use for loop to iterate over the colors
    for (let i = 0; i < colorVal; i++) {
      const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )} ,${Math.floor(Math.random() * 256)})`;

      //    push this value into colors array
      colors.push(color);
    }
    return colors;
  };

  //    create data of chart for students
  const chartDataStudents = {
    labels: courses?.map((course) => course?.courseName),
    datasets: [
      {
        data: courses?.map((course) => course?.totalEnrolledStudents),
        backgroundColor: generateRandomColors(courses?.length),
      },
    ],
  };

  // create chart data of income
  const chartIncomeData = {
    labels: courses?.map((course) => course?.courseName),
    datasets: [
      {
        data: courses?.map((course) => course?.totalAmountGenerated),
        backgroundColor: generateRandomColors(courses?.length),
      },
    ],
  };

  //    create options
  const options = {
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "left",
        labels: {
          font: {
            size: 15, // Change font size of labels
            family: "'Arial', sans-serif", // Change font family of labels
            weight: "", // Change font weight of labels
          },
          color: "grey", // Change color of labels
        },
      },
      tooltip: {
        bodyFont: {
          size: 14, // Change font size of tooltip labels
        },
      },
    },
    responsive: true,
  };
  return (
    <div className="flex flex-1 flex-col gap-y-0 rounded-md bg-richblack-800 p-6 h-full ">
      <p className="text-xl font-bold mb-1 text-richblack-5">Visualize</p>
      <div className="space-x-4 mt-1 font-semibold">
        {/* Button to switch to the "students" chart */}
        <button
          onClick={() => setCurrChart("students")}
          className={`rounded-sm text-lg p-1 px-3 transition-all duration-200 ${
            currChart === "students"
              ? "bg-richblack-700 text-blue-100"
              : "text-yellow-400"
          }`}
        >
          Students
        </button>
        {/* Button to switch to the "income" chart */}
        <button
          onClick={() => setCurrChart("income")}
          className={`rounded-sm text-lg p-1 px-3 transition-all duration-200 ${
            currChart === "income"
              ? "bg-richblack-700 text-blue-100"
              : "text-yellow-400"
          }`}
        >
          Income
        </button>
      </div>
      <div className=" relative mx-auto aspect-auto text-lg h-full w-full">
        {/* Render the Pie chart based on the selected chart */}
        <Pie
          data={currChart === "students" ? chartDataStudents : chartIncomeData}
          options={options}
        />
      </div>
    </div>
  );
};
