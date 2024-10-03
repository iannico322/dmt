import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReactToPrint } from 'react-to-print'; 
import { Input } from "@/components/ui/input"



// Helper function to get the week number within a month from a date
const getWeekNumberWithinMonth = (date: Date) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const day = startOfMonth.getDay();
  return Math.ceil((date.getDate() + day) / 7);
};

// Helper function to get the month name from a date
const getMonthName = (monthIndex:any) => {
  const date = new Date();
  date.setMonth(monthIndex);
  return date.toLocaleString('default', { month: 'long' });
};

export default function Page1() {
  const [records, setRecords] = useState<any[]>([]);
  const [currentRecord, setCurrentRecord] = useState<Partial<any>>({});
  const [_status, setStatus] = useState<'out' | 'in' | 'break'>('out');
  const printableRef = useRef<HTMLDivElement>(null); // Use ref for printing
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  useEffect(() => {
    const storedRecords = localStorage.getItem('timeRecords');
    if (storedRecords) {
      setRecords(JSON.parse(storedRecords));
    }

    const names = localStorage.getItem('name');
    if (names) {
      setName(names)
    }}
    , []);

    const handleTimeAction = (action: 'in' | 'out' | 'breakIn' | 'breakOut') => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      const dateString = now.toLocaleDateString();
    
      if (action === 'in') {
        const recordExistsForToday = records.some(record => record.date === dateString);
        if (recordExistsForToday) {
          alert("A record already exists for today. You cannot create more than one record per day.");
          return;
        }
    
        const newRecord: any = {
          date: dateString,
          timeIn: timeString,
        };
    
        setCurrentRecord(newRecord);
        updateLocalStorageCurrentRecord(newRecord); // Store in localStorage
        const updatedRecords = [...records, newRecord];
        setRecords(updatedRecords);
        localStorage.setItem('timeRecords', JSON.stringify(updatedRecords));
        setStatus('in');
    
      } else if (action === 'breakOut') {
        if (!currentRecord.timeIn) {
          alert("You must 'Time In' before taking a break.");
          return;
        }
    
        const updatedRecord: any = {
          ...currentRecord,
          breakOut: timeString,
        };
    
        setCurrentRecord(updatedRecord);
        updateLocalStorageCurrentRecord(updatedRecord); // Store in localStorage
        const updatedRecords = records.map(record =>
          record.date === updatedRecord.date ? updatedRecord : record
        );
        setRecords(updatedRecords);
        localStorage.setItem('timeRecords', JSON.stringify(updatedRecords));
        setStatus('break');
    
      } else if (action === 'breakIn') {
        if (!currentRecord.breakOut) {
          alert("You must 'Break Out' before 'Break In'.");
          return;
        }
    
        const updatedRecord: any = {
          ...currentRecord,
          breakIn: timeString,
        };
    
        setCurrentRecord(updatedRecord);
        updateLocalStorageCurrentRecord(updatedRecord); // Store in localStorage
        const updatedRecords = records.map(record =>
          record.date === updatedRecord.date ? updatedRecord : record
        );
        setRecords(updatedRecords);
        localStorage.setItem('timeRecords', JSON.stringify(updatedRecords));
        setStatus('in');
    
      } else if (action === 'out') {
        if (!currentRecord.timeIn) {
          alert("You must 'Time In' before 'Time Out'.");
          return;
        }
    
        const timeOut = timeString;
        const timeIn = new Date(`${dateString} ${currentRecord.timeIn}`);
        const breakOut = currentRecord.breakOut ? new Date(`${dateString} ${currentRecord.breakOut}`) : null;
        const breakIn = currentRecord.breakIn ? new Date(`${dateString} ${currentRecord.breakIn}`) : null;
    
        let totalMilliseconds = now.getTime() - timeIn.getTime();
        if (breakOut && breakIn) {
          totalMilliseconds -= breakIn.getTime() - breakOut.getTime();
        }
    
        const totalHours = (totalMilliseconds / (1000 * 60 * 60)).toFixed(2);
    
        const updatedRecord: any = {
          ...currentRecord,
          timeOut,
          totalHours,
        };
    
        setCurrentRecord(updatedRecord);
        updateLocalStorageCurrentRecord(updatedRecord); // Store in localStorage
        const updatedRecords = records.map(record =>
          record.date === updatedRecord.date ? updatedRecord : record
        );
        setRecords(updatedRecords);
        localStorage.setItem('timeRecords', JSON.stringify(updatedRecords));
        
        setCurrentRecord({});
        updateLocalStorageCurrentRecord({}); // Clear from localStorage
        setStatus('out');
      }
    };

    const updateLocalStorageCurrentRecord = (record: any) => {
      localStorage.setItem('currentRecord', JSON.stringify(record));
    };
    
    // Retrieve currentRecord and records from localStorage when the component mounts
    useEffect(() => {
      const storedCurrentRecord = localStorage.getItem('currentRecord');
      if (storedCurrentRecord) {
        setCurrentRecord(JSON.parse(storedCurrentRecord));
      }
    
      const storedRecords = localStorage.getItem('timeRecords');
      if (storedRecords) {
        setRecords(JSON.parse(storedRecords));
      }
    }, []);
    

  useEffect(()=>{
    console.log(currentRecord)
  },[currentRecord])

  const handlePrint = useReactToPrint({
    content: () => printableRef.current,
  });

  // Calculate the available months from the records
  const months = Array.from(new Set(records.map(record => new Date(record.date).getMonth())));

  // Calculate the available weeks for the selected month
  const weeks = selectedMonth !== null
    ? Array.from(new Set(records
      .filter(record => new Date(record.date).getMonth() === selectedMonth)
      .map(record => getWeekNumberWithinMonth(new Date(record.date)))
    ))
    : [];

  // Filter records by the selected month and week
  const filteredRecords = records.filter(record => {
    const recordDate = new Date(record.date);
    const isSameMonth = selectedMonth === null || recordDate.getMonth() === selectedMonth;
    const isSameWeek = selectedWeek === null || getWeekNumberWithinMonth(recordDate) === selectedWeek;
    return isSameMonth && isSameWeek;
  });


  const [name,setName] = useState("")


  useEffect(()=>{
    localStorage.setItem('name',name)
  },[name])

 
  return (
    <Card className="w-full max-w-4xl mx-auto mt-[100px] mb-[100px] sm:mx-6 ">
      <div className=' flex w-full justify-between items-center'>
        <CardHeader>
        <CardTitle>Daily Time Record System</CardTitle>
      </CardHeader>
      <div className=' flex gap-2'>
        <Input type='text' placeholder='Name' value={name} onChange={(e:any)=>{
               
                setName(e.target.value)
              
                
              
        }}/>
      </div>
      <Button className=' mr-10' onClick={handlePrint}>Print Records</Button>
      </div>
      
      <CardContent>
        <div className="flex justify-center sm:overflow-auto sm:flex-wrap gap-3  mb-6">
          <Button onClick={() => handleTimeAction('in')} >Time In</Button>
          <Button onClick={() => handleTimeAction('breakOut')} >Break Out</Button>
          <Button onClick={() => handleTimeAction('breakIn')} >Break In</Button>
          <Button onClick={() => handleTimeAction('out')}>Time Out</Button>
         
        </div>
        {/* Month Selector */}
        
        <div className="mb-4">
          <label htmlFor="monthSelect" className="mr-2">Select Month:</label>
          <select
            id="monthSelect"
            
            onChange={(e) => {
              setSelectedMonth(e.target.value ? parseInt(e.target.value, 10) : null);
              setSelectedWeek(null); // Reset week selection when month changes
            }}
            className="border p-2 text-primary-foreground"
          >
            <option value="">All Months</option>
            {months.map((month) => (
              <option className=" text-primary-foreground" key={month} value={month}>
                {getMonthName(month)}
              </option>
            ))}
          </select>
        </div>
        {/* Week Selector */}
        {selectedMonth !== null && (
          <div className="mb-4">
            <label htmlFor="weekSelect" className="mr-2">Select Week:</label>
            <select
              id="weekSelect"
              onChange={(e) => setSelectedWeek(e.target.value ? parseInt(e.target.value, 10) : null)}
              className="border p-2 text-primary-foreground"
            >
              <option className=" text-primary-foreground" value="">All Weeks</option>
              {weeks.map((week) => (
                <option key={week} value={week}>
                  Week {week}
                </option>
              ))}
            </select>
          </div>
        )}
        <div ref={printableRef} id="printableArea" className='' >
          <h1 className=' text-xl font-bold text-center py-5'>{name}</h1>
          <h1 className=' text-lg font-bold text-center pb-5 '>{getMonthName(selectedMonth)}</h1>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time In</TableHead>
                <TableHead>Break Out</TableHead>
                <TableHead>Break In</TableHead>
                <TableHead>Time Out</TableHead>
                <TableHead>Total Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.timeIn}</TableCell>
                  <TableCell>{record.breakOut || '-'}</TableCell>
                  <TableCell>{record.breakIn || '-'}</TableCell>
                  <TableCell>{record.timeOut}</TableCell>
                  <TableCell>{record.totalHours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-between items-center">
          {/* Pagination controls or other components can be added here */}
        </div>
      </CardContent>
    </Card>
  );
}
