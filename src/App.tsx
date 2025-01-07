import { ThemeProvider } from "@/components/theme-provider"
import { useState } from "react";
import viteLogo from "/DICT.png";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { ListFilter } from "lucide-react";
import LGUServiceDropdown from "./screens/centralOffice/testing/ServicesList";
import DataPresentationOptions from "./screens/centralOffice/testing/DataPresentationOptions";
import Profile  from "./assets/Layer_1@2x.png";
function App() {
  const [activeItem, setActiveItem] = useState<string>("Reports");
  const navigate = useNavigate();

  const menuItems = [
    { name: "Reports", path: "/dmt/reports" },
    { name: "Utilization Status", path: "/dmt/utilization" },
    { name: "RO Utilization Status", path: "/dmt/ro-utilization" },
    { name: "LGU", path: "/dmt/lgu" }
  ];

  const handleMenuClick = (item: string, path: string) => {
    setActiveItem(item);
    navigate(path);
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="min-h-screen w-full flex">
        <nav className="fixed top-0 left-0 w-[20vw] h-screen bg-[#0136a8] z-[99999] flex flex-col items-start p-5">
          <Link className="flex w-full mr-5 gap-2 " to="/dmt/">
            <img src={viteLogo} className="logo h-20 object-contain self-center" alt="DICT logo" />
          </Link>
          <h1 className="text-white font-gmedium text-xl mt-10">DATA DASHBOARD</h1>
          <div className="text-white flex gap-1 font-gmedium mt-4">
            <ListFilter/> Filter
          </div>
          <LGUServiceDropdown/>
          <DataPresentationOptions/>
        </nav>

        <div className="flex-1 ml-[20vw]">
          <header className="sticky top-0 z-50 bg-white/20 backdrop-blur-md h-[100px] w-full px-20 flex items-center justify-between text-[#6B6B6B]">
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

              <img className=" rounded-full w-10 h-10" src={Profile} alt="" />
            <div className="font-gsemibold">  Welcome, (Nico Gwapo)</div>
            </div>
            
          </header>

          <main className="min-h-[calc(100vh-100px)] w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;