import { ThemeProvider } from "@/components/theme-provider"

import viteLogo from "/DICT.png";
// import { ModeToggle } from "./components/mode-toggle";

import { Link, Outlet } from "react-router-dom";

// import { ModeToggle } from "./components/mode-toggle";
// import Reveal from "./components/animation/reveal";


function App() {


  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
     <div className=" bg-background min-h-screen w-full overflow-hidden flex flex-col  items-center">
      
      <nav className=" mt-4  animate__animated animate__slideInDown  z-20 bg-background/0 fixed flex items-center w-full  py-5 border-b-[0px] border-accent   mx-9 sm:mx-4">
        <Link className=" ml-5 flex  gap-2" to="/dmt/" >
          <img src={viteLogo} className="logo h-10 object-contain  " alt="DICT logo" />
         
        </Link>
        <div className=" w-3 h-3">

        </div>
      </nav>
 

      
      <div className=" min-h-full w-full flex items-center justify-center ">
         <Outlet />
      </div>
     
     
    </div>
    </ThemeProvider>
  )
}



export default App
