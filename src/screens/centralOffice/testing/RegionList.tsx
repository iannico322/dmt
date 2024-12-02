import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

const RegionsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Updated services array as JSON
  const [services, setServices] = useState([
    { name: "Ilocos Region (Region I)", state: false },
    { name: "Cagayan Valley (Region II)", state: false },
    { name: "Central Luzon (Region III)", state: false },
    { name: "CALABARZON (Region IV-A)", state: false },
    { name: "MIMAROPA (Region IV-B)", state: false },
    { name: "Bicol Region (Region V)", state: false },
    { name: "Western Visayas (Region VI)", state: false },
    { name: "Central Visayas (Region VII)", state: false },
    { name: "Eastern Visayas (Region VIII)", state: false },
    { name: "Zamboanga Peninsula (Region IX)", state: false },
    { name: "Northern Mindanao (Region X)", state: false },
    { name: "Davao Region (Region XI)", state: false },
    { name: "SOCCSKSARGEN (Region XII)", state: false },
    { name: "Caraga (Region XIII)", state: false },
    { name: "BARMM (Bangsamoro Autonomous Region in Muslim Mindanao)", state: false },
    { name: "National Capital Region (NCR)", state: false },
  ]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (serviceName: string) => {
    // Update the state of the specific service
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.name === serviceName
          ? { ...service, state: !service.state }
          : service
      )
    );
  };

  return (
    <div
      className={
        isOpen
          ? "relative w-full z-50 rounded-[100px]"
          : "rounded-none z-50 relative w-full"
      }
    >
      {/* Dropdown Box */}
      <div
        className={`border-gray-300 z-50 rounded-sm border  shadow-sm ${
          isOpen ? "" : ""
        }`}
      >
        {/* Dropdown Button */}
        <button
          onClick={toggleDropdown}
          className="w-full text-left  bg-white px-4 py-2 focus:outline-none flex justify-between focus:ring-2 focus:ring-blue-500  rounded-sm text-sm"
        >
          Select Regions <span>{isOpen ? <ChevronUp /> : <ChevronDown />}</span>
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute rounded-sm mt-2 w-full z-50 bg-white border border-t-0 border-gray-300 pb-2 pt-2 shadow-sm">
          {services.map((service, index) => (
            <label
              key={index}
              className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={service.state} // Bind checked state
                onChange={() => handleCheckboxChange(service.name)}
                className="mr-2 h-4 w-4 text-sm text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              {service.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegionsDropdown;
