import React, { useEffect } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useSelector } from 'react-redux';
import { selectCharts } from './../../../redux/chartSlice';

const ChartsDashboard: React.FC = () => {
  const charts = useSelector(selectCharts);

  useEffect(() => {
    console.log(charts);
  }, [charts]);

  // Bar Chart Configuration
  const barChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['NCR', 'CAR', 'Region I', 'Region II', 'Region III', 'Region IV'],
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + '';
        },
      },
    },
    legend: {
      position: 'top',
    },
    colors: ['#1e40af', '#fbbf24'],
    title: {
      text: 'Operational vs Developmental Metrics',
      align: 'left',
    },
  };

  const barChartSeries = [
    {
      name: 'Operational',
      data: [30, 40, 35, 20, 35, 30],
    },
    {
      name: 'Developmental',
      data: [20, 35, 25, 30, 25, 20],
    },
  ];

  // Line Chart Configuration
  const lineChartOptions: ApexOptions = {
    chart: {
      type: 'line',
      height: 350,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    xaxis: {
      categories: ['NCR', 'CAR', 'Region I', 'Region II', 'Region III', 'Region IV'],
    },
    colors: ['#1e40af', '#fbbf24'],
    legend: {
      position: 'top',
    },
    title: {
      text: 'Trend Analysis',
      align: 'left',
    },
  };

  const lineChartSeries = [
    {
      name: 'Operational',
      data: [30, 40, 35, 20, 35, 30],
    },
    {
      name: 'Developmental',
      data: [20, 35, 25, 30, 25, 20],
    },
  ];

  // Pie Chart Configuration
  const pieChartOptions: ApexOptions = {
    chart: {
      type: 'pie',
      height: 350,
    },
    labels: ['NCR', 'CAR', 'Region I', 'Region II', 'Region III', 'Region IV'],
    colors: ['#1e40af', '#fbbf24', '#c72832'],
    legend: {
      position: 'bottom',
    },
    title: {
      text: 'Regional Distribution',
      align: 'left',
    },
  };

  const pieChartSeries = [30, 40, 35, 20, 35, 30];

  // Check if chart is visible based on the chart name in the Redux state
  const isBarGraphVisible = charts.includes('Bar Graph');
  const isLineGraphVisible = charts.includes('Line Graph');
  const isPieGraphVisible = charts.includes('Pie Graph');

  return (
    <div className="p-6 bg-gray-100 min-h-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        {isBarGraphVisible && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <Chart options={barChartOptions} series={barChartSeries} type="bar" height={350} />
          </div>
        )}

        {/* Line Chart */}
        {isLineGraphVisible && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <Chart options={lineChartOptions} series={lineChartSeries} type="line" height={350} />
          </div>
        )}

        {/* Pie Chart */}
        {isPieGraphVisible && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <Chart options={pieChartOptions} series={pieChartSeries} type="pie" height={350} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartsDashboard;
