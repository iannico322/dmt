import React, { useCallback, useMemo, useState, useRef, memo } from 'react';
import { animated, useSpring } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import LGUServicesDropdown from './testing/ServicesList';
import DataPresentationOptions from './testing/DataPresentationOptions';
import PhMap from './map/phMap';
import viteLogo from "/DICT.png";
import { Link } from 'react-router-dom';
import { Chart } from './testing/Chart';
import SelectDropdown from './testing/Dropdown';
import RegionsDropdown from './testing/RegionList';
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const years = ['2024', '2023', '2022', '2021'];
const INITIAL_RESULT = {
    id: "PH",
    operational: 0,
    development: 0,
    trainingOrOthers: 0,
    withdraw: 0,
};

function Central() {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPresentation, setSelectedPresentation] = useState('Bar Graph');

  const [result, setResult] = useState(INITIAL_RESULT);
  const [data, setData] = useState<any[]>([]);
  const [clickedRegion, setClickedRegion] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('All Months');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Transform state for zoom and pan
  const [transform, setTransform] = useState({
    scale: 1,
    x: 0,
    y: 0
  });

  // Ref for the map container
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Update transform state for zoom and pan
  const debouncedSetTransform = useCallback((newTransform: Partial<typeof transform>) => {
    setTransform(prev => ({
      ...prev,
      ...newTransform
    }));
  }, []);

  // Gesture handling for drag (no zooming via scroll anymore)
  const bind = useGesture(
    {
      onDrag: ({ offset: [x, y] }) => {
        debouncedSetTransform({ x, y });
      }
    },
    {
      drag: {
        from: () => [transform.x, transform.y],
        bounds: { left: -300, right: 300, top: -300, bottom: 300 },
      }
    }
  );

  // Spring animation for smooth transitions
  const springProps = useSpring({
    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
    config: {
      mass: 1,
      tension: 100,
      friction: 20,
    },
  });

  // Memoized map component
  const memoizedPhMap = useMemo(
    () => (
      <PhMap
        springProps={springProps}
        data={data}
        setData={setData}
        selectedMonth={selectedMonth}
        setSelectedRegion={setSelectedRegion}
        selectedRegion={selectedRegion}
        setResult={setResult}
        clickedRegion={clickedRegion}
        setClickedRegion={setClickedRegion}
      />
    ),
    [springProps, data, selectedMonth, selectedRegion, clickedRegion]
  );

  // Zoom In and Zoom Out functions
  const handleZoomIn = () => {
    debouncedSetTransform({
      scale: Math.min(transform.scale + 0.2, 3), // Limit max zoom level
    });
  };

  const handleZoomOut = () => {
    debouncedSetTransform({
      scale: Math.max(transform.scale - 0.2, 0.8), // Limit min zoom level
    });
  };



  // Memoized select component

 const [selectedValue,setSelectedValue] =  useState<any>("")
 const [selectedValue2,setSelectedValue2] =  useState<any>("")

  return (
    <div className="min-h-[500vh] flex flex-col items-center">
      {/* Header */}
      <div className='sticky top-0 h-[120px] pointer-events-none  pt-5 flex z-[9999] justify-between items-start mt-10 mx-5 w-full col-span-2'>
        <Link className="ml-5 flex gap-2" to="/dmt/">
          <img src={viteLogo} className="logo h-10 object-contain" alt="DICT logo" />
        </Link>
        <div className="flex items-center pr-5">
          <span className="text-gray-600 font-semibold">Welcome, (Omair) </span>
        </div>
      </div>

      <div className='w-[90%] flex flex-col gap-10 min-h-[20vh]'>
      
        <div className='w-full items-center z-[999]  justify-between px-5 translate-y-[70px] flex min-h-[100px] bg-[#ebeff5] border rounded-sm md:flex-col md:py-2 md:gap-3'>
            <h1 className=' absolute translate-y-[-80px] translate-x-[-20px] font-gsemibold text-xl'>Data Monitoring Dashboard</h1>
        <div className=' flex gap-2 w-[500px] md:w-full'>
        <SelectDropdown
            options={months}
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
            id="monthDropdown"
            placeholder="Select a month"
            />

<SelectDropdown
            options={years}
            value={selectedValue2}
            onChange={(e) => setSelectedValue2(e.target.value)}
            id="yearDropdown"
            placeholder="Select a year"
            />

        </div>
        <div className=' z-[99999] w-[30%] md:w-full'>
            <RegionsDropdown/>
        </div>
       
        
        </div>
        <div className='relative w-full flex md:flex-col h-full justify-between  gap-10'>
          {/* Sidebar */}
          <div className='sticky top-0 z-[99] flex flex-col gap-4 pt-[80px] md:pt-[100px] w-[30%] md:w-[100%] h-full '>
            <LGUServicesDropdown />
            <DataPresentationOptions />
          </div>
          
          {/* Map Container */}
          <div className=' w-[70%] md:w-[100%] h-full flex flex-col gap-10'>

          
          <div 
            ref={mapContainerRef}
            {...bind()}
            className='relative w-full h-[70vh] mt-[80px] flex flex-col bg-[#ebeff5] overflow-hidden'
            style={{
              touchAction: 'none',
              userSelect: 'none',
            }}
          >
            {/* Zoom Buttons */}
            <div className="absolute z-20 bottom-4 right-4 flex flex-col space-y-2">
              <button 
                onClick={handleZoomIn} 
                className="p-2 bg-gray-700 text-white rounded shadow hover:bg-gray-800"
              >
                +
              </button>
              <button 
                onClick={handleZoomOut} 
                className="p-2 bg-gray-700 text-white rounded shadow hover:bg-gray-800"
              >
                -
              </button>
            </div>

            <animated.div
              style={{
                width: '100%',
                height: '100%',
                transformOrigin: 'center center',
                ...springProps,
              }}
            >
              {memoizedPhMap}
            </animated.div>
           
          </div>
          <Chart/>
</div>

        </div>


      
      </div>

      {/* Additional Divs */}
      <div className='sticky top-0 mt-[120px] w-[90%] flex flex-col h-[20vh] bg-black'></div>
      <div className='sticky top-0 mt-[120px] w-[90%] flex flex-col h-[100vh] bg-red-600'></div>
    </div>
  );
}

export default Central;
