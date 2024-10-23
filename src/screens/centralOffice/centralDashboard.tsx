import React, { useEffect, useState } from "react";
import regionsData from "../sampleData.json";
import PieChart01 from "./charts/pieChart";
import Linechart from "./charts/lineChart";
import Summary from "./charts/summary";
import PhMap from "./map/phMap";
import { useGesture } from "react-use-gesture";
import { useSpring } from "react-spring";
import axios from "./../../plugin/axios";

const MapComponent: React.FC = () => {
  const [result, setResult] = useState<any>({
    id: "PH",
    operational: 0,
    development: 0,
    trainingOrOthers: 0,
    withdraw: 0,
  });
  const [data, setData] = useState<any[]>([]);

  const months = [
    "All Months", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const [clickedRegion, setClickedRegion] = useState<string | null>(null); 
  const [selectedMonth, setSelectedMonth] = useState<string>('All Months');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [scale, setScale] = useState(1); // Zoom level
  const [position, setPosition] = useState({ x: 0, y: 0 }); // For dragging/panning

  const bind = useGesture({
    onDrag: ({ offset: [x, y] }) => setPosition({ x, y }),
    onPinch: ({ offset: [d] }) => setScale(Math.max(0.5, d / 100)),
    onWheel: ({ delta: [, dy] }) => setScale((prev) => Math.max(0.5, prev - dy * 0.001)),
  });

  const GetAllBP = () => {

    // setInterval(()=>{

    // },1000)
    
    axios.get('').then((e) => {
      setData(e.data);
      setResult(calculateTotals(e.data, 'All Months')); // Initial load with all months
    });
  };

  const springProps = useSpring({
    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
  });

  useEffect(() => {
    GetAllBP();
    setSelectedRegion(`Philippines eLGU IBPLS Status`);
  }, []);

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

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected:any = event.target.value;
    if (selected == 'All Months') {
      GetAllBP()
    }
    setSelectedMonth(selected);
    setResult(calculateTotals(data, selected));
  };

  return (
    <div className="relative flex w-screen h-screen items-center justify-center">
      <div className="">
        {/* <Linechart newData={calculateTotals(regionsData)} /> */}
      </div>

      <div
        {...bind()}
        className="relative flex md:m-2 md:w-full w-[100%] sm:h-[80vh] h-[100vh] border overflow-hidden items-start justify-end rounded-md"
        
      
      >
        <div className="absolute overflow-hidden pointer-events-none flex items-end justify-end md:mr-2 mr-5 w-screen min-h-[90px] mt-10 rounded-lg z-30 flex-col gap-4">
          <h1 className="font-semibold pointer-events-auto font-gextrabold text-2xl text-end" onClick={()=>{
          setClickedRegion(null)
          GetAllBP();
          setSelectedRegion(`Philippines eLGU IBPLS Status`);
          setSelectedMonth('All Months')
        }}>
            {selectedRegion}
          </h1>
          <div className="flex flex-col space-y-2">
            <label htmlFor="monthDropdown" className="text-lg font-semibold">
              Select a Month in 2024:
            </label>
            <select
              id="monthDropdown"
              className="pointer-events-auto w-64 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              {months.map((month, index) => (
                <option key={index} value={month}>
                  {`${month} 2024`}
                </option>
              ))}
            </select>
          </div>

          {result ? <Summary result={result} /> : ""}
        </div>
        <div className="absolute self-end z-30">
          {result ? <PieChart01 data={result} /> : ""}
        </div>
        <PhMap
          springProps={springProps}
          data={data}
          setData={setData}
          calculateTotals={calculateTotals}
          selectedMonth={selectedMonth}
          setSelectedRegion={setSelectedRegion}
          selectedRegion={selectedRegion}
          setResult={setResult}
          clickedRegion={clickedRegion}
          setClickedRegion={setClickedRegion}
        />
      </div>
    </div>
  );
};

export default MapComponent;
