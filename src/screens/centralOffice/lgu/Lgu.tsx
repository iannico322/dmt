import axios from "./../../../plugin/axios2";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { debounce } from "lodash";

interface LGU {
  geocode: string;
  name: string;
  province: string;
  region: string;
  district: string;
  level: string;
  incomeClass: string;
  utilizationStatus: string;
}

const LGU: React.FC = () => {
  const [lguList, setLguList] = useState<LGU[]>([]);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedLGU, setSelectedLGU] = useState<LGU | null>(null);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // Debounce the search update
  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 700),
    []
  );

  useEffect(() => {

    if (search === "") {
      setSelectedLGU(null);
      setDebouncedSearch("");
    } else {
      debouncedSetSearch(search);
    }
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [search, debouncedSetSearch]);

  const transformLGUData = (rawData: string[][]) => {
    return rawData.map(row => {
      if (!Array.isArray(row) || row.length === 0) return null;

      return {
        geocode: row[2] || '',
        name: row[1] || '',
        province: row[7] || '',
        region: row[5] || '',
        district: row[10] || '',
        level: row[9] || '',
        incomeClass: row[10] || '',
        utilizationStatus:  '-'
      };
    }).filter((lgu): lgu is LGU => lgu !== null);
  };

  const filteredLGUs = useMemo(
    () =>
      lguList.filter(
        (lgu) =>
          lgu.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    [debouncedSearch, lguList]
  );

  const handleSelect = (lgu: LGU) => {
    setSearch(lgu.name);
    setSelectedLGU(lgu);
    setShowSuggestions(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    if (search && filteredLGUs.length > 0) {
      setShowSuggestions(true);
    }
  };

  function GetLGUs() {
    axios.get('13MnnJ7ozNftvHy53dsBKGO7s1iOyfCALYMyP1s4CaF4/values/PSGC 22-3Q', {
      headers: {
        Authorization: `Token ${import.meta.env.VITE_TOKEN}`,
      },
    }).then((response) => {
      const rawData = response.data.values.slice(2);
      const transformedData = transformLGUData(rawData);
      console.log(transformedData)
      setLguList(transformedData);
    });
  }

  useEffect(() => {
    GetLGUs();
  }, []);

  return (
    <div className="w-full h-full px-5 flex flex-col items-center gap-10">
      <div className="bg-[#EBEFF5] border border-border flex flex-col px-10 py-4 rounded w-[80%] relative">
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="search" className="block text-[#6B6B6B] font-gmedium">
            LGU
          </label>
          <div className="relative">
            <input
              type="search"
              id="search"
              className="w-full p-2 border outline-[#6B6B6B] text-[#6B6B6B] font-gregular pl-4 rounded-sm"
              placeholder="Search LGU"
              value={search}
              onChange={handleSearchChange}
              onFocus={handleInputFocus}
            />
            {showSuggestions && search && filteredLGUs.length > 0 && (
              <ul className="absolute bg-white border rounded mt-2 shadow w-full z-10 max-h-60 overflow-y-auto">
                {filteredLGUs.map((lgu) => (
                  <li
                    key={lgu.geocode}
                    className="p-2 hover:bg-gray-200 cursor-pointer border-b last:border-b-0"
                    onClick={() => handleSelect(lgu)}
                  >
                    {lgu.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 w-[60%] self-center flex rounded-md bg-white border border-border">
        <table className="w-full text-left rounded-2xl overflow-hidden border border-border">
          <tbody>
            <tr>
              <th className="py-2 w-[40%] px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">Geocode</th>
              <td className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">{selectedLGU?.geocode || "-"}</td>
            </tr>
            <tr>
              <th className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">Name</th>
              <td className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">{selectedLGU?.name || "-"}</td>
            </tr>
            <tr>
              <th className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">Province</th>
              <td className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">{selectedLGU?.province || "-"}</td>
            </tr>
            <tr>
              <th className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">Region</th>
              <td className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">{selectedLGU?.region || "-"}</td>
            </tr>
            <tr>
              <th className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">District</th>
              <td className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">{selectedLGU?.district || "-"}</td>
            </tr>
            <tr>
              <th className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">Level</th>
              <td className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">{selectedLGU?.level || "-"}</td>
            </tr>
            <tr>
              <th className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">Income Class</th>
              <td className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">{selectedLGU?.incomeClass || "-"}</td>
            </tr>
            <tr>
              <th className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">Utilization Status</th>
              <td className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">{selectedLGU?.utilizationStatus || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LGU;