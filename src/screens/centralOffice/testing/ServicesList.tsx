import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

const LGUServiceDropdown = () => {
  const [isOpen, setIsOpen] = useState(true);

  // Updated services array as JSON
  const [services, setServices] = useState([
    { name: "Business Permit V1", state: true },
    { name: "Business Permit V2", state: true },
    { name: "Building Permit", state: true },
    { name: "Certificate of Occupancy", state: true },
    { name: "Working Permit", state: true },
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
          ? "relative mt-2 outline-none w-full h-[270px] rounded-[100px]"
          : "rounded-none mt-2 outline-none relative w-full"
      }
    >
      {/* Dropdown Box */}
      <div
        className={`border-gray-300 outline-none mt-2 border-x-0 border-y-2 rounded-none  ${
          isOpen ? "" : ""
        }`}
      >
        {/* Dropdown Button */}
        <button
          onClick={toggleDropdown}
          className="w-full text-left outline-none rounded-none text-white px-4 py-2 focus:outline-none flex justify-between  font-gsemibold"
        >
          eLGU Services <span>{isOpen ? <ChevronUp className=" rotate-90" /> : <ChevronDown />}</span>
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute w-full outline-none text-white pb-2 pt-2 ">
          {services.map((service, index) => (
            <label
              key={index}
              className="flex items-center px-4 py-2 text-sm  cursor-pointer"
            >
              <input
                type="checkbox"
                checked={service.state} // Bind checked state
                onChange={() => handleCheckboxChange(service.name)}
                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              {service.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default LGUServiceDropdown;
