import { animated } from "react-spring";
import phRegions from "./phRegions.json";
import { useCallback, useState } from "react";


// Constants outside component
const MONTHS = [
  "All Months", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
function PhMap({selectedMonth,data, setResult, setSelectedRegion, springProps,clickedRegion,setClickedRegion}: any) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
// New state for clicked region


  const getLatestMonth = (data: any[]): string => {
    return data.reduce((latest, item) => {
        const currentDate = new Date(item.date);
        const latestDate = new Date(latest);
        return currentDate > latestDate ? item.date : latest;
    }, data[0]?.date || '');
}; 

const monthToFormattedValue = useCallback((month: string) => {
  const year = new Date().getFullYear();
  const monthIndex = MONTHS.indexOf(month);
  if (monthIndex === 0) return 'All Months';
  return `${year}-${monthIndex}`;
}, []);
  const calculateTotals = (data: any[],_date:string) => {
    // Get the latest month from the data
    if (!data || data.length === 0) {
      return [];
    }

    // Determine the month to use for filtering
    let latestMonth: string = getLatestMonth(data);
    
    // If a specific month is selected, use that instead of the latest month
    if (selectedMonth && selectedMonth !== 'All Months') {
      const formattedMonth = monthToFormattedValue(selectedMonth);
      latestMonth = formattedMonth;
    }

    let totals = {
        id: "PH",
        operational: 0,
        development: 0,
        trainingOrOthers: 0,
        withdraw: 0,
    };

    // Filter data for the latest month
    data.filter((item: any) => item.date === latestMonth)
        .forEach((item: any) => {
            totals.operational += parseInt(item.operational);
            totals.development += parseInt(item.development);
            totals.trainingOrOthers += parseInt(item.trainingOrOthers);
            totals.withdraw += parseInt(item.withdraw);
        });

    return totals;
};
  return (
    <animated.svg
        className=" animate__animated animate__fadeIn"
      width="100%"
      height="100%"
      viewBox="200 0 602.39 1109.44"
      style={{ ...springProps, cursor: "grab", touchAction: "none" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {phRegions.map((e: any) => (
        <g key={e.id}>
          <path
            id={e.id}
            d={e.d}
            fill={
              clickedRegion === e.id
                ? "#1c1d6e" // Color when the region is clicked
                : hoveredRegion === e.id
                ? "#1c1d6e" // Color when the region is hovered
                : "#3e4a5a" // Default color
            }
            onMouseEnter={() => setHoveredRegion(e.id)}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={() => {
              setClickedRegion(e.id); // Set the clicked region
              setSelectedRegion(`${e.name} \n (${e.id})`);
              let out: any = data.filter((x: any) => x.region === e.id );
              setResult( calculateTotals( out,selectedMonth));
            }}
            className="cursor-pointer"
          >
            <title >{e.id}</title>
          </path>
          <text
            x={e.x} // X-coordinate based on center
            y={e.y} // Y-coordinate based on center
            fontSize="8"
            fill="#e7be16"
            textAnchor="middle"
            pointerEvents="none"
            dominantBaseline="middle"
          >
            {e.id}
          </text>
        </g>
      ))}
    </animated.svg>
  );
}

export default PhMap;
