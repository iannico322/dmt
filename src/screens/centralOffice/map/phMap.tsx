import { animated } from "react-spring";
import regionsData from "./../../sampleData.json";
import phRegions from "./phRegions.json";
import { useState } from "react";



function PhMap({selectedMonth,data, setData,setResult, setSelectedRegion, springProps,clickedRegion,setClickedRegion}: any) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
// New state for clicked region
  const months = [
    "All Months", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const calculateTotals = (e: any, selectedMonth: string) => {
    let totals = {
      id: "PH",
      operational: 0,
      development: 0,
      trainingOrOthers: 0,
      withdraw: 0,
    };

    e.filter((item: any) => {
      if (selectedMonth === "All Months") return true;
      const itemMonth = new Date(item.date).getMonth() + 1; // Extract month from date
      return months[itemMonth] === selectedMonth;
    }).map((item: any) => {
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
                ? "#fddc03" // Color when the region is clicked
                : hoveredRegion === e.id
                ? "#fddc03" // Color when the region is hovered
                : "#6f93ef" // Default color
            }
            onMouseEnter={() => setHoveredRegion(e.id)}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={() => {
              setClickedRegion(e.id); // Set the clicked region
              setSelectedRegion(`${e.name} \n (${e.id})`);
              let out: any = data.filter((x: any) => x.region === e.id );

             
              console.log("asds",out, selectedMonth,e.id)
              setResult( calculateTotals( out,selectedMonth));
            }}
            className="cursor-pointer"
          >
            <title>{e.id}</title>
          </path>
          <text
            x={e.x} // X-coordinate based on center
            y={e.y} // Y-coordinate based on center
            fontSize="8"
            fill="#212529"
            textAnchor="middle"
            pointerEvents="none"
            dominantBaseline="middle"
          >
            {e.name}
          </text>
        </g>
      ))}
    </animated.svg>
  );
}

export default PhMap;
