import React, { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "react-spring";
import { useGesture } from "react-use-gesture";
import phRegions from '../phRegions.json'; 

import regionsData from '../sampleData.json'; 
import PieChart01 from "./pieChart";
import Linechart from "./lineChart";

const MapComponent: React.FC = () => {
  const [scale, setScale] = useState(1); // Zoom level
  const [position, setPosition] = useState({ x: 0, y: 0 }); // For dragging/panning
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const [result,setResult] = useState<any>()

  const [selectedRegion,setSelectedRegion] = useState<string | null>(null);

  const operationalSpring = useSpring({
    from: { number: 0 },
    number: result ? result.operational : 0,
    delay: 100,
    config: { mass: 1, tension: 180, friction: 12 },
  });

  const developmentSpring = useSpring({
    from: { number: 0 },
    number: result ? result.development : 0,
    delay: 140,
    config: { mass: 1, tension: 180, friction: 12 },
  });

  const trainingSpring = useSpring({
    from: { number: 0 },
    number: result ? result.trainingOrOthers : 0,
    delay: 160,
    config: { mass: 1, tension: 180, friction: 12 },
  });

  const withdrawSpring = useSpring({
    from: { number: 0 },
    number: result ? result.withdraw : 0,
    delay: 180,
    config: { mass: 1, tension: 180, friction: 12 },
  });


  // Gesture binding for zooming and panning
  const bind = useGesture({
    onDrag: ({ movement: [mx, my], memo = [position.x, position.y] }) => {
      // Update the position when dragging
      setPosition({ x: memo[0] + mx, y: memo[1] + my });
      return memo;
    },
    onWheel: ({ delta: [, dy] }) => {
      // Zoom on mouse wheel
      setScale((prev) => Math.max(0.5, prev + dy * -0.001));
    }
  });

  const springProps = useSpring({
    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
    config: { tension: 300, friction: 30 }
  });




const [regionCenters, setRegionCenters] = useState<{ [key: string]: { x: number, y: number } }>({});

  const mapRef:any = useRef(null);
  useEffect(() => {
    // Get all path elements and calculate their centers
    if (mapRef.current) {
      const paths = mapRef.current.querySelectorAll('path');
      const newCenters:any = {};

      paths.forEach((path: any) => {
        const bbox = path.getBBox();
        newCenters[path.id] = {
          x: bbox.x + bbox.width / 2,
          y: bbox.y + bbox.height / 2
        };
      });

      setRegionCenters(newCenters);
    }
  }, [mapRef]);


  const calculateTotals = (data:any) => {
    // Initialize totals
    const totals = {
      operational: 0,
      development: 0,
      trainingOrOthers: 0,
      withdraw: 0,
    };
  
    // Loop through each item in the data array
    data.forEach((item:any) => {
      totals.operational += item.operational;
      totals.development += item.development;
      totals.trainingOrOthers += item.trainingOrOthers;
      totals.withdraw += item.withdraw;
    });
  
    return totals;
  };



  return (
    <>
    
    <div className=" relative flex w-screen h-screen items-center justify-between  ">

    <div>
      <Linechart newData={calculateTotals(regionsData)}/>
   
      </div>
    
      <div {...bind()} className=" relative flex mr-20 md:m-2  md:w-full w-[40%] h-[80vh] border  bg-slate-500/5 overflow-hidden  items-start justify-end  rounded-md ">
      <div className=" absolute overflow-hidden pointer-events-none  flex items-end justify-end md:mr-2 mr-5 w-[300px] min-h-[90px]  mt-10 rounded-lg z-30 flex-col gap-4  ">
        <h1 className=" font-semibold font-gextrabold text-2xl text-end">{selectedRegion}</h1>

        
       {result?
       <>
       <div className=" flex flex-col justify-end items-end ">
          <h1 className=" font-gextrabold text-green-400 text-4xl drop-shadow-sm">
            <animated.span>
              {operationalSpring.number.to((n) => n.toFixed(0))}
            </animated.span></h1>
          <p className="  text-[7px] font-gsemibold " >OPERATIONAL</p>
        </div>

        <div className=" flex flex-col justify-end items-end ">
          <h1 className=" font-gextrabold text-yellow-400 text-4xl">
            <animated.span>
              {developmentSpring.number.to((n) => n.toFixed(0))}
            </animated.span></h1>
          <p className="  text-[7px] font-gsemibold " >DEVELOPMENTAL</p>
        </div>

        <div className=" flex flex-col justify-end items-end ">
          <h1 className=" font-gextrabold text-orange-600 text-4xl">
            <animated.span>
              {trainingSpring.number.to((n) => n.toFixed(0))}
            </animated.span></h1>
          <p className="  text-[7px] font-gsemibold " >FOR TRAINING/OTHERS</p>
        </div>

        <div className=" flex flex-col justify-end items-end ">
          <h1 className=" font-gextrabold text-red-600 text-4xl"><animated.span>
              {withdrawSpring.number.to((n) => n.toFixed(0))}
            </animated.span></h1>
          <p className="  text-[7px] font-gsemibold " >WITHDRAW</p>
        </div>
        </> : ""}
      </div>
      <div className=" absolute self-end z-30">
      {result?
        <PieChart01 data={result}/>:""}
      </div>
      
      <animated.svg
        width="100%"
        height="100%"
        viewBox="200 0 602.39 1109.44"
        style={{ ...springProps, cursor: "grab" }}
        xmlns="http://www.w3.org/2000/svg"
        ref={mapRef}
      >
      
        

   {phRegions.map((e:any)=>(
<g key={e.id}>
    <path id={e.id} d={e.d} fill={hoveredRegion === e.id ? "#fddc03" : "#6f93ef"}
   onMouseEnter={() => setHoveredRegion(e.id)}
   
   onMouseLeave={() => setHoveredRegion(null)}
   onClick={ async() => {setSelectedRegion(`${e.name} \n (${e.id})`)

    let out:any =  regionsData.filter((x:any)=>x.id == e.id)

    console.log(out[0])

    setResult(out?out[0]:"")


    
  
  
  
  }}
   >
    <title>{e.id}</title>
   </path>

   {regionCenters[e.id] && (
    <>
            <text
              x={regionCenters[e.id].x} // X-coordinate based on center
              y={regionCenters[e.id].y} // Y-coordinate based on center
              fontSize="8"
              fill="#212529"
              textAnchor="middle"
              pointerEvents="none"
              style={{zIndex:9999}}
              dominantBaseline="middle"

             
            >
              {e.name}
            </text>
            
          </>
          )}
   
   </g>
   ))}

   
  
        
      </animated.svg>
      </div>
    </div>
    
    </>
  );
};

export default MapComponent;
