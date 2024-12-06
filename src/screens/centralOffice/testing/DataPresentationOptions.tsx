import { ChevronDown, ChevronUp } from "lucide-react";
import  { useEffect, useState } from "react";

const DataPresentationOptions = () => {
  const [isOpen, setIsOpen] = useState(true);

  const [presentationOptions, setPresentationOptions] = useState(() => {
    // Try to get the item from localStorage
    const storedCharts = localStorage.getItem('charts');
    
    // Parse the stored item, or use a default value if it doesn't exist
    return storedCharts ? JSON.parse(storedCharts) : [
      {"name":"Bar Graph","state":true},
      {"name":"Line Graph","state":true},
      {"name":"Pie Graph","state":true}
    ];
  });


  

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(()=>{
    localStorage.setItem('charts',JSON.stringify(presentationOptions))
  },[presentationOptions])

  const handleCheckboxChange = (optionName: string) => {
    setPresentationOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.name === optionName
          ? { ...option, state: !option.state }
          : option
      )
    );
  };

  return (
    <div
      className={
        isOpen
          ? "relative w-full h-[270px] rounded-[100px]"
          : "rounded-none relative w-full"
      }
    >
      {/* Dropdown Box */}
      <div className={`border-gray-300 border rounded-none shadow-sm`}>
        {/* Dropdown Button */}
        <button
          onClick={toggleDropdown}
          className="w-full text-left rounded-none bg-white px-4 py-2 focus:outline-none flex justify-between focus:ring-2 focus:ring-blue-500 font-gsemibold"
        >
          Data Presentation{" "}
          <span>{isOpen ? <ChevronUp /> : <ChevronDown />}</span>
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute w-full bg-white border border-t-0 border-gray-300 pb-2 pt-2 shadow-sm">
          {presentationOptions.map((option, index) => (
            <label
              key={index}
              className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={option.state}
                onChange={() => handleCheckboxChange(option.name)}
                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              {option.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataPresentationOptions;