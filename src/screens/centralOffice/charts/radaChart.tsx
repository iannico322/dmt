import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const RadarChart: React.FC = () => {
  const options: ApexOptions = {
    chart: {
      type: 'radar',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
      toolbar: {
        show: false,
      },
    },
    colors: ['#10b981', '#f59e0b', '#ec4899', '#06b6d4'],
    stroke: {
      width: 2,
    },
    fill: {
      opacity: 0.25,
    },
    markers: {
      size: 3,
     
      shape:'square', // Change markers to squares
       
    },
    xaxis: {
      categories: ['Operational', 'Developmental', 'Training', 'Withdraw'],
    },
    yaxis: {
      show: false,
    },
   
    legend: {
      position:"right",
      offsetY: 20,
      fontSize: '8px',
      horizontalAlign: 'center',
      floating: false,
      itemMargin: {
        horizontal: 10,
        vertical: 2,
      },
    },
    plotOptions: {
      radar: {
        polygons: {
          strokeColors: '#3e4a5a',
          connectorColors: '#3e4a5a',
        },
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          legend: {
            fontSize: '10px',
            itemMargin: {
              horizontal: 5,
              vertical: 3,
            },
          },
        },
      },
    ],
  };

  const series = [
    { name: 'Region I', data: [65, 45, 30, 20] },
    { name: 'Region II', data: [85, 60, 40, 25] },
    { name: 'Region III', data: [75, 75, 50, 30] },
    { name: 'Region IV-A', data: [80, 70, 45, 35] },
    { name: 'MIMAROPA', data: [70, 55, 35, 25] },
    { name: 'Region V', data: [60, 50, 40, 20] },
    { name: 'Region VI', data: [55, 45, 35, 15] },
  ];

  return (
    <div className="w-full h-full"> {/* Adjust the height percentage as needed */}
      <ReactApexChart
        options={options}
        series={series}
        type="radar"
        height="100%"
        width="100%"
      />
    </div>
  );
};

export default RadarChart;
