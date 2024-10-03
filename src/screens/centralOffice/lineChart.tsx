import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";


const LineChart = ({ newData }:any) => {
  // Define colors array
  const colors = ['#5ae08b', '#facc15', '#ea5c12', '#dc2626'];

  // Initialize the chart data and options
  const [chartData, setChartData] = useState<any>({
    series: [
      {
        data: [0, 0, 0, 0], // Default data
      },
    ],
    options: {
      chart: {
        
        height: 350,
        type: "bar",
        events: {
          click: function (chart: any, w: any, e: any) {
            // You can handle the click event here
            console.log(chart, w, e);
          },
        },
      },
      colors: colors,
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: [
          [
        "Operational"],
        ["Developmental"],
        ["For Training/Others"],
        ["Withdraw"]
      ],
        
        labels: {
          style: {
            colors: colors,
            fontSize: "12px",
          },
        },
      },
    },
  });

  // Effect to update chart data when props.newData changes
  useEffect(() => {

    if (newData) {
        const valueList = Object.values(newData);
        setChartData((prevData:any) => ({
            ...prevData,
            series: [
              {
                data: valueList, // Update the data with the new data from props
              },
            ],
          }));
      }
  }, [newData]); // Runs whenever newData changes

  return (
    <div>
      <div className=" flex flex-col gap-8">
        <h1 className=" text-2xl font-gsemibold">Current eLGU IBPLS in Philippines</h1>
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default LineChart;
