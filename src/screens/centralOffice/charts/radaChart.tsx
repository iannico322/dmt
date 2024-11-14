import React, { useCallback } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const RadarChart: React.FC = (data:any) => {
  const calculateLatestRegionalTotals = useCallback((data: any[]) => {
    // Find the most recent date
    const latestDate = new Date(Math.max(...data.map(item => new Date(item.date).getTime())));
    
    // Filter data to only include entries from the latest month
    const latestMonthData = data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getMonth() === latestDate.getMonth() &&
             itemDate.getFullYear() === latestDate.getFullYear();
    });
  
    // Get unique regions from the filtered data
    const uniqueRegions = [...new Set(latestMonthData.map(item => item.region))];
    
    // Initialize an object to hold totals for each region
    const regionalTotals = uniqueRegions.reduce((acc, region) => {
      acc[region] = {
        operational: 0,
        development: 0,
        trainingOrOthers: 0,
        withdraw: 0
      };
      return acc;
    }, {} as Record<string, Record<string, number>>);
  
    // Accumulate totals for each region (only for the latest month)
    latestMonthData.forEach(item => {
      regionalTotals[item.region].operational += parseInt(String(item.operational)) || 0;
      regionalTotals[item.region].development += parseInt(String(item.development)) || 0;
      regionalTotals[item.region].trainingOrOthers += parseInt(String(item.trainingOrOthers)) || 0;
      regionalTotals[item.region].withdraw += parseInt(String(item.withdraw)) || 0;
    });
  
    // Transform into the exact format you want and sort by operational expenses
    const result = uniqueRegions
      .map(region => ({
        name: region,
        data: [
          regionalTotals[region].operational,
          regionalTotals[region].development,
          regionalTotals[region].trainingOrOthers,
          regionalTotals[region].withdraw
        ],
        operationalValue: regionalTotals[region].operational // for sorting
      }))
      .sort((a, b) => b.operationalValue - a.operationalValue)
      .slice(0, 8)
      .map(({ name, data }) => ({ name, data })); // Remove the sorting field
  
    return result;
  }, []);
  



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

  const series = data ? calculateLatestRegionalTotals(data.data): [];;

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
