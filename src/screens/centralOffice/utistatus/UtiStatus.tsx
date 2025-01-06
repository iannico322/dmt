import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import Chart from 'react-apexcharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns-tz';

// Define color constants
const COLOR_OPERATIONAL = '#0136A8';
const COLOR_DEVELOPMENTAL = '#F8CD1C';
const COLOR_FOR_TRAINING = '#CE1126';
const COLOR_WITHDRAW = '#72CFF1';

export const UtiStatus = () => {
  const [selectedRegion, setSelectedRegion] = useState('Select Region');
  const [selectedProvince, setSelectedProvince] = useState('Select Province');
  const [provinces, setProvinces] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedQuarter, setSelectedQuarter] = useState<string>('');

  const regions = [
    'Region I', 'Region II', 'Region III', 'Region IV-A', 'Region IV-B', 'Region V', 'Region VI', 'Region VII', 'Region VIII', 'Region IX', 'Region X', 'Region XI', 'Region XII', 'Region XIII', 'NCR', 'CAR', 'BARMM'
  ];

  const provincesByRegion = {
    'Region I': ['Ilocos Norte', 'Ilocos Sur', 'La Union', 'Pangasinan'],
    'Region II': ['Batanes', 'Cagayan', 'Isabela', 'Nueva Vizcaya', 'Quirino'],
    'Region III': ['Aurora', 'Bataan', 'Bulacan', 'Nueva Ecija', 'Pampanga', 'Tarlac', 'Zambales'],
    'Region IV-A': ['Batangas', 'Cavite', 'Laguna', 'Quezon', 'Rizal'],
    'Region IV-B': ['Marinduque', 'Occidental Mindoro', 'Oriental Mindoro', 'Palawan', 'Romblon'],
    'Region V': ['Albay', 'Camarines Norte', 'Camarines Sur', 'Catanduanes', 'Masbate', 'Sorsogon'],
    'Region VI': ['Aklan', 'Antique', 'Capiz', 'Guimaras', 'Iloilo', 'Negros Occidental'],
    'Region VII': ['Bohol', 'Cebu', 'Negros Oriental', 'Siquijor'],
    'Region VIII': ['Biliran', 'Eastern Samar', 'Leyte', 'Northern Samar', 'Samar', 'Southern Leyte'],
    'Region IX': ['Zamboanga del Norte', 'Zamboanga del Sur', 'Zamboanga Sibugay'],
    'Region X': ['Bukidnon', 'Camiguin', 'Lanao del Norte', 'Misamis Occidental', 'Misamis Oriental'],
    'Region XI': ['Davao de Oro', 'Davao del Norte', 'Davao del Sur', 'Davao Occidental', 'Davao Oriental'],
    'Region XII': ['Cotabato', 'Sarangani', 'South Cotabato', 'Sultan Kudarat'],
    'Region XIII': ['Agusan del Norte', 'Agusan del Sur', 'Dinagat Islands', 'Surigao del Norte', 'Surigao del Sur'],
    'NCR': ['Caloocan', 'Las Piñas', 'Makati', 'Malabon', 'Mandaluyong', 'Manila', 'Marikina', 'Muntinlupa', 'Navotas', 'Parañaque', 'Pasay', 'Pasig', 'Pateros', 'Quezon City', 'San Juan', 'Taguig', 'Valenzuela'],
    'CAR': ['Abra', 'Apayao', 'Benguet', 'Ifugao', 'Kalinga', 'Mountain Province'],
    'BARMM': ['Basilan', 'Lanao del Sur', 'Maguindanao', 'Sulu', 'Tawi-Tawi']
  };

  const getStatusColor = (category: any) => {
    switch (category) {
      case 'Operational':
        return COLOR_OPERATIONAL;
      case 'Developmental':
        return COLOR_DEVELOPMENTAL;
      case 'For Training/Others':
        return COLOR_FOR_TRAINING;
      case 'Withdraw':
        return COLOR_WITHDRAW;
      default:
        return 'transparent';
    }
  };

  const onRegionChange = (region: any) => {
    setSelectedRegion(region);
    setProvinces(provincesByRegion[region] || []);
    setSelectedProvince('Select Province');
  };

  const onProvinceChange = (province: any) => {
    setSelectedProvince(province);
  };

  const determineQuarter = (date: Date) => {
    const month = date.getMonth() + 1;
    if (month >= 1 && month <= 3) return 'first';
    if (month >= 4 && month <= 6) return 'second';
    if (month >= 7 && month <= 9) return 'third';
    if (month >= 10 && month <= 12) return 'fourth';
    return '';
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const pstDate = format(date, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: 'Asia/Manila' });
      console.log(pstDate);
      setSelectedQuarter(determineQuarter(date));
    }
    setSelectedDate(date);
  };

  const combinedSeries = [
    {
      name: "Operational",
      data: [10, 40, 20, 50, 30, 40, 35, 45, 55, 65, 75, 85],
    },
    {
      name: "Developmental",
      data: [15, 35, 25, 45, 35, 45, 40, 50, 60, 70, 80, 90]
    },
    {
      name: "For Training/Others",
      data: [20, 30, 30, 40, 40, 50, 45, 55, 65, 75, 85, 95]
    },
    {
      name: "Withdraw",
      data: [25, 25, 35, 35, 45, 55, 50, 60, 70, 80, 90, 100]
    }
  ];

  const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const options2 = {
    chart: {
      type: 'line',
      height: 350
    },
    xaxis: {
      categories: categories
    },
    yaxis: {
      title: {
        text: 'Values'
      }
    },
    stroke: {
      curve: 'straight'
    },
    markers: {
      size: 5
    }
  };

  const chartHeight = 350;

  const optionsOperational = {
    ...options2,
    title: {
      text: 'Business Permit',
      align: 'left'
    },
    colors: [COLOR_OPERATIONAL],
    chart: {
      height: chartHeight
    }
  };

  const optionsDevelopmental = {
    ...options2,
    title: {
      text: 'Barangay Clearance',
      align: 'left'
    },
    colors: [COLOR_DEVELOPMENTAL],
    chart: {
      height: chartHeight
    }
  };

  const optionsForTraining = {
    ...options2,
    title: {
      text: 'Working Permit',
      align: 'left'
    },
    colors: [COLOR_FOR_TRAINING],
    chart: {
      height: chartHeight
    }
  };

  const optionsWithdraw = {
    ...options2,
    title: {
      text: 'Building Permit and Certificate of Occupancy',
      align: 'left'
    },
    colors: [COLOR_WITHDRAW],
    chart: {
      height: chartHeight
    }
  };

  const chartOptions = {
    chart: {
      type: 'bar',
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      categories: [
        'Business Permit', 
        'Barangay Clearance', 
        'Working Permit', 
        'Building Permit and Certificate of Occupancy'
      ],
      labels: {
        rotate: 0,
      },
    },
    yaxis: {
      title: {
        text: 'Number of Permits',
      },
    },
    title: {
      text: 'Comparison of Different Types of Permits',
    },
    colors: [COLOR_OPERATIONAL, COLOR_DEVELOPMENTAL, COLOR_FOR_TRAINING, COLOR_WITHDRAW], 
  };
  
  const chartSeries = [
    {
      name: 'Operational',
      data: [12, 19, 3, 5],
    },
    {
      name: 'Developmental',
      data: [3, 10, 13, 15],
    },
    {
      name: 'For Training/Others',
      data: [2, 3, 20, 5],
    },
    {
      name: 'Withdraw',
      data: [15, 9, 10, 10],
    },
  ];

  const statuses = [
    { category: 'Operational', color: 'bg-gray-100 ' },
    { category: 'Developmental', color: 'bg-white' },
    { category: 'For Training/Others', color: 'bg-gray-100 ' },
    { category: 'Withdraw', color: 'bg-white' },
  ];

  const permits = [
    { name: 'Business Permit', values: [12, 19, 3, 5] },
    { name: 'Barangay Clearance', values: [2, 3, 20, 5] },
    { name: 'Working Permit', values: [3, 10, 13, 15] },
    { name: 'Building Permit and Certificate of Occupancy', values: [15, 9, 10, 10] },
  ];

  return (
    <div className='z-50 bg-white h-screen w-screen flex-wrap flex items-center justify-center p-5'>
      {/* Selection */}
      <div className='grid grid-cols-4 gap-2 p-4 bg-gray-100 rounded-lg w-[90%] mb-5 md:grid-cols-2'>

        {/* Select date */}
        <div className="w-full md:w-auto">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            placeholderText="Select Date"
            className="form-control w-[320px] max-w-xs p-2 md:w-[295px] sm:w-[150px] se:w-[155px] text-base border rounded-lg"
          />
        </div>

        {/* Select quarter */}
        <div className="w-full md:w-auto">
        <Select value={selectedQuarter} onValueChange={(e:any) => setSelectedQuarter(e.target.value)}>
          <SelectTrigger>
            <SelectValue placeholder="Quarter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="first">First Quarter</SelectItem>
            <SelectItem value="second">Second Quarter</SelectItem>
            <SelectItem value="third">Third Quarter</SelectItem>
            <SelectItem value="fourth">Fourth Quarter</SelectItem>
          </SelectContent>
        </Select>
        </div>

        {/* Select region*/}
        <div className="w-full md:w-auto">
          <Select onValueChange={onRegionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Select province */}  
        <div className="w-full md:w-auto">
          <Select onValueChange={onProvinceChange} disabled={selectedRegion === 'Select Region'}>
            <SelectTrigger>
              <SelectValue placeholder={selectedProvince} />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bar Chart */}
      <div className='md:overflow-auto flex flex-row gap-4 p-4 bg-gray-50 rounded-lg w-[90%] border border- mb-5 justify-center items-center'>
        <div className='min-w-[1000px]'>
          <Chart className="w-full ml-20" options={chartOptions} series={chartSeries} type="bar" height={350} />
        </div>
      </div>

      {/* Table */}
      <div className='flex flex-row gap-4 p-4 bg-white rounded-lg w-[90%] mb-5 border'>  
        <div className="overflow-auto w-full">
          <Table className="min-w-full bg-white border border-gray-200">
            <TableHeader className="bg-white">
              <TableRow>
                <TableHead className="py-2 px-4 border-b"></TableHead>
                {permits.map((permit) => (
                  <TableHead key={permit.name} className="py-2 px-4 border-b">
                      {permit.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {statuses.map((status, rowIndex) => (
                <TableRow key={status.category} className={status.color}>
                  <TableCell className="py-2 px-4 border-b">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 mr-2 border" 
                        style={{ backgroundColor: getStatusColor(status.category) }}
                      ></div>
                      {status.category}
                    </div>
                  </TableCell>
                  {permits.map((permit) => (
                    <TableCell key={permit.name} className="py-2 px-4 border-b">
                      {permit.values[rowIndex]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Line Charts */}
      <div className='flex flex-row gap-4 bg-white rounded-lg w-[90%] mb-5 border justify-center items-center'>
        <div className='flex flex-row gap-4 md:flex-wrap p-4 w-full'>
          <div className='bg-white p-4 rounded-lg shadow-md w-full md:w-1/2 lg:w-1/4'>
            <Chart options={optionsOperational} series={combinedSeries} type="line" height={chartHeight} />
          </div>
          <div className='bg-white p-4 rounded-lg shadow-md w-full md:w-1/2 lg:w-1/4'>
            <Chart options={optionsDevelopmental} series={combinedSeries} type="line" height={chartHeight} />
          </div>
          <div className='bg-white p-4 rounded-lg shadow-md w-full md:w-1/2 lg:w-1/4'>
            <Chart options={optionsForTraining} series={combinedSeries} type="line" height={chartHeight} />
          </div>
          <div className='bg-white p-4 rounded-lg shadow-md w-full md:w-1/2 lg:w-1/4'>
            <Chart options={optionsWithdraw} series={combinedSeries} type="line" height={chartHeight} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UtiStatus;