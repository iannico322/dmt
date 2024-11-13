
import { motion } from 'framer-motion';
import { useSpring, animated } from "react-spring";
const regions = [
  { id: 10, name: 'Region 10', value: 373 },
  { id: 3, name: 'Region 3', value: 350 },
  { id: 4, name: 'Region 4-A', value: 280 },
  { id: 1, name: 'Region 1', value: 250 },
  { id: 13, name: 'Region 13', value: 220 },
  { id: 0, name: 'NCR', value: 190 },
  { id: 6, name: 'Region 6', value: 180 },
  { id: 2, name: 'Region 2', value: 140 },
];

const rankColors = [
  '#03045e', // 1st
  '#023e8a', // 2nd
  '#0077b6', // 3rd
  '#0096c7', // 4th
  '#00b4d8', // 5th
  '#48cae4', // 6th
  '#8aebff', // 7th
  '#caf0f8', // 8th
];

export function RegionRanking() {
  const maxValue = Math.max(...regions.map(r => r.value));
  const useOperationalSpring = (value: number, delay = 100) => {
    const spring = useSpring({
      from: { number: 0 },
      number: value,
      delay: delay,
      config: { mass: 1, tension: 180, friction: 12 },
    });
  
    return spring;
  };
  return (
    <div className="rounded-xl  p-6 flex flex-col gap-3 pointer-events-none">
      <h2 className="text-xl font-bold text-[#0B1354] font-gbold">Region Ranking</h2>
      <div className="flex flex-col">
        {regions.map((region, index) => (
          <motion.div
            key={region.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className="relative flex-1 h-10">
                <motion.div
                style={{
                    backgroundColor: `${rankColors[index]}E6`, // Adding 'B3' for 70% opacity
                  }}
                  className="absolute inset-y-0 left-0 rounded-e-[3px]  backdrop-blur-sm"
                  
                  initial={{ width: 0 }}
                  animate={{ width: `${(region.value / maxValue) * 100}%` }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <div className="h-full flex items-center justify-between px-4 w-full">
                    <span className={`font-medium truncate text-xs gap-3 flex  items-center font-gbold ${index >= 4 ? 'text-gray-900' : 'text-white'}`}>
                      <span className=' text-base'>{index + 1}.</span>  {region.name}
                    </span>
                    <motion.span
                      className={`font-semibold ml-2 ${index >= 4 ? 'text-gray-900' : 'text-white'}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: (index * 0.1) + 0.5 }}
                    >

<animated.span>
              {useOperationalSpring(region.value).number.to((n) => n.toFixed(0))}
            </animated.span>
                    
                    </motion.span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}