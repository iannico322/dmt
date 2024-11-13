import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const LineChart: React.FC = () => {
  // State to trigger initial animation
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    // Force a re-render to trigger animations
    setChartKey((prev) => prev + 1);
  }, []);

  const options: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1000, // Slightly slower speed for more effect
        animateGradually: {
          enabled: true,
          delay: 200,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 500,
        },
      },
      zoom: {
        enabled: false,
      },
    },
    colors: [
      '#10b981', // emerald-500 (Operational)
      '#f59e0b', // amber-500 (Developmental)
      '#ec4899', // pink-500 (Training)
      '#06b6d4', // cyan-500 (Withdraw)
    ],
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    xaxis: {
      categories: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ],
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px',
        },
      },
      min: 0,
      max: 400,
      tickAmount: 4,
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    markers: {
      size: 5,
      hover: {
        size: 7,
      },
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (value: number) => value.toString(),
      },
    },
  };

  const series = [
    {
      name: 'Operational',
      data: [220, 340, 150, 70, 260, 310, 280, 220, 190, 250, 300, 270],
    },
    {
      name: 'Developmental',
      data: [90, 150, 180, 250, 210, 160, 190, 220, 240, 200, 180, 160],
    },
    {
      name: 'Training',
      data: [160, 190, 80, 170, 170, 150, 140, 160, 190, 210, 180, 150],
    },
    {
      name: 'Withdraw',
      data: [150, 200, 90, 150, 120, 140, 160, 130, 110, 140, 170, 190],
    },
  ];

  return (
    <div className="w-full h-[300px]">
      <div className="w-full h-full overflow-x-scroll overflow-y-hidden">
        <div className="min-w-[800px] h-full">
          <ReactApexChart
            key={chartKey} // Using the key to re-render and trigger animations
            options={options}
            series={series}
            type="line"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default LineChart;
