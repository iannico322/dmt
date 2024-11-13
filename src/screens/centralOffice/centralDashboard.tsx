import React, { useEffect, useState } from "react";
import { motion } from 'framer-motion';

import Summary from "./charts/summary";
import PhMap from "./map/phMap";
import { useGesture } from "react-use-gesture";
import { useSpring } from "react-spring";
import axios from "./../../plugin/axios";
import { RegionRanking } from "./charts/ranking";
import RadarChart from "./charts/radaChart";
import LineChart from "./charts/lineChart";

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
  const projects = ['All Project',
    'Business Permit',
    'Working Permit',
    'Certificate of Occupancy',
    'Local Civil Registry',
    'eCedula'
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
  const charWidth = 16; // estimated width per character in pixels
  const baseWidth = 0; // additional padding
  const calculatedWidth = selectedRegion? selectedRegion.length * charWidth + baseWidth : 12* charWidth + baseWidth ;




  return (
    <div className="relative flex w-screen h-screen items-center justify-center">
      <div className=" absolute z-20 w-[30vw] flex flex-col left-0 top-0 mt-[10vh]">
        {/* <LineChart2 chartData={data}/> */}
        <RegionRanking/>
        
        
      </div>
   

        <motion.div 
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
       
      >
        <div className="z-30 absolute h-[58vh] w-[450px] ml-5  flex left-0 bottom-0 flex-col items-end">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-0 translate-y-10">
           
              <h2 className="text-gray-600 sm:text-xl font-gmedium">Total Operational</h2>
              <h1 className="text-[#1a237e] text-4xl sm:text-6xl font-gbold ">2353</h1>
              <p className="text-gray-600 font-gsemibold ">eLGU across the Philippines</p>
            
           
          </div>
          
      
        <div className=" w-full h-full ">
           <RadarChart/>
        </div>
           
           
            
        
         
        </div>
      </motion.div>



      <div
        {...bind()}
        className="relative flex md:m-2 md:w-full w-[100%] sm:h-[80vh] h-[100vh] border overflow-hidden items-start justify-end rounded-md"
        
      
      >
        <div className="absolute overflow-hidden pointer-events-none flex items-end justify-end  w-screen min-h-[90px] mt-10 z-30 flex-col gap-4">
          
          <motion.div className=" bg-gradient-to-r from-[#12C6FC] to-[#194ACA] min-w-0 pl-9 rounded-s-sm overflow-hidden "
         initial={{ width: 0,opacity:0 }}
         animate={{ width: calculatedWidth,opacity:100 }}
         transition={{
           duration: 0.8,
           ease: 'easeOut',
         }}
          >
            <h1 className="py-5 pr-10 pl-1 truncate text-white font-semibold pointer-events-auto font-gextrabold text-2xl text-end" onClick={()=>{
          setClickedRegion(null)
          GetAllBP();
          setSelectedRegion(`Philippines eLGU IBPLS Status`);
          setSelectedMonth('All Months')
        }}>
            {selectedRegion}
          </h1>
          </motion.div>
          <div className="flex gap-3">
            <div className="flex flex-col space-y-2 md:mr-2 mr-5">
            <label htmlFor="monthDropdown" className="text-lg font-semibold">
              Select a Project:
            </label>
            <select
              id="monthDropdown"
              className="pointer-events-auto w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    
            >
              {projects.map((month, index) => (
                <option key={index} value={month}>
                  {`${month}`}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col space-y-2 md:mr-2 mr-5">
            <label htmlFor="monthDropdown" className="text-lg font-semibold">
              Select a Month in 2024:
            </label>
            <select
              id="monthDropdown"
              className="pointer-events-auto w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          </div>
          

          {result ? <Summary result={result} /> : ""}
        </div>
  
        <div className="absolute self-end z-30">
          {/* {result ? <PieChart01 data={result} /> : ""} */}
          <div className="w-[45vw]   h-full m-6 ">
              <LineChart />
            </div>
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
