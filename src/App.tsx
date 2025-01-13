import { ThemeProvider } from "@/components/theme-provider"
import { useState, useEffect } from "react";
import viteLogo from "/DICT.png";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { ListFilter } from "lucide-react";
import LGUServiceDropdown from "./screens/centralOffice/testing/ServicesList";
import DataPresentationOptions from "./screens/centralOffice/testing/DataPresentationOptions";
import Profile from "./assets/Layer_1@2x.png";
import APIs from "./screens/index.json"
import axios from "./plugin/axios";
import { useSelector} from 'react-redux';
import {selectRegions } from './redux/regionSlice';
interface RegionData {
  region: string;
  operational: number;
  DEVELOPMENTAL: number;
  TRAINING: number;
  WITHDRAW: number;
}

interface MonthlyData {
  date: string;
  data: RegionData[];
}

function App() {

  const regionss = useSelector(selectRegions);
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    { name: "Reports", path: "/dmt/reports" },
    { name: "Utilization Status", path: "/dmt/utilization" },
    { name: "RO Utilization Status", path: "/dmt/ro-utilization" },
    { name: "LGU", path: "/dmt/lgu" }
  ];

  const [monthlyStats, setMonthlyStats] = useState<MonthlyData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Filter APIs based on regionss
        const filteredAPIs = APIs.filter(api => 
          regionss.includes(api.region)
        );

        const requests = filteredAPIs.map(api => 
          axios.get(`${api.url}/values/BP1 Count (by Cat)`, {
            headers: {
              Authorization: "Token b22ac5a9da3ddc5088984eb00e3b122cd2f6d057fcc84cb6ff81daaabd151fff",
            }
          })
        );

        const responses = await Promise.all(requests);

        // Process responses
        const processedData = new Map<string, RegionData[]>();

        responses.forEach((response, index) => {
          const values = response.data.values;
          const region = filteredAPIs[index].region;  // Use filteredAPIs instead of APIs

          // Start from index 5 to skip headers
          values.slice(5).forEach((row: string[]) => {
            const date = row[0].split(' ')[0];
            
            const regionData: RegionData = {
              region,
              operational: parseInt(row[4]) || 0,
              DEVELOPMENTAL: parseInt(row[5]) || 0,
              TRAINING: parseInt(row[6]) || 0,
              WITHDRAW: parseInt(row[7]) || 0,
            };

            if (!processedData.has(date)) {
              processedData.set(date, []);
            }
            processedData.get(date)?.push(regionData);
          });
        });

        const result: MonthlyData[] = Array.from(processedData.entries()).map(([date, data]) => ({
          date,
          data
        }));

        setMonthlyStats(result);
        console.log('Data fetched:', result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [regionss]); // Add regionss as dependency

  // Initialize activeItem from localStorage or based on current path
  const [activeItem, setActiveItem] = useState(() => {
    const savedItem = localStorage.getItem('activeMenuItem');
    if (savedItem) return savedItem;
    
    // If no saved item, determine from current path
    const currentPath = location.pathname;
    const matchingItem = menuItems.find(item => currentPath.includes(item.path.split('/').pop() || ''));
    return matchingItem ? matchingItem.name : "Reports";
  });

  // Update activeItem when location changes
  useEffect(() => {
    const currentPath = location.pathname;
    const matchingItem = menuItems.find(item => currentPath.includes(item.path.split('/').pop() || ''));
    if (matchingItem) {
      setActiveItem(matchingItem.name);
      localStorage.setItem('activeMenuItem', matchingItem.name);
    }
  }, [location.pathname]);

  const handleMenuClick = (item: string, path: string) => {
    setActiveItem(item);
    localStorage.setItem('activeMenuItem', item);
    navigate(path);
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="min-h-screen w-full flex">
        <nav className="fixed top-0 left-0 w-[20vw] md:hidden h-screen bg-[#0136a8] z-[99999] flex flex-col items-start p-5">
          <Link className="flex w-full mr-5 gap-2" to="/dmt/">
            <img src={viteLogo} className="logo h-20 object-contain self-center" alt="DICT logo" />
          </Link>
          <h1 className="text-white font-gmedium text-xl mt-10">DATA DASHBOARD</h1>
          <div className="text-white flex gap-1 font-gmedium mt-4">
            <ListFilter/> Filter
          </div>
          <LGUServiceDropdown/>
          <DataPresentationOptions/>
        </nav>

        <div className="flex-1 ml-[20vw] md:ml-0">
          <header className="sticky top-0 z-50 md:hidden bg-white/20 backdrop-blur-md h-[100px] w-full px-20 flex items-center justify-between text-[#6B6B6B]">
            <ul className="flex gap-10">
              {menuItems.map((item) => (
                <li
                  key={item.name}
                  onClick={() => handleMenuClick(item.name, item.path)}
                  className={`border border-t-0 border-r-0 border-l-0 cursor-pointer ${
                    activeItem === item.name
                      ? "border-b-2 border-[#0136a8] font-gsemibold text-[#0136a8]"
                      : "border-b-0 hover:border-b-2 hover:border-[#0136a8] hover:font-gsemibold hover:text-[#0136a8]"
                  }`}
                >
                  {item.name}
                </li>
              ))}
            </ul>

            <div className="flex gap-2 items-center">
              <img className="rounded-full w-10 h-10" src={Profile} alt="" />
              <div className="font-gsemibold">Welcome, (Nico Gwapo)</div>
            </div>
          </header>

          <main className="w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;