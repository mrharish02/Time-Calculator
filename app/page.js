"use client"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns"
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { HoursTable } from "@/components/common/HoursTable";

const formatLocalDate = (date) => {
  // Create a new Date instance
  const localDate = new Date(date);

  // Adjust for the timezone offset
  localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());

  // Format to 'yyyy-mm-dd'
  return localDate.toISOString().slice(0, 10);
};

export default function Home() {
  const [staffNo, setStaffNo] = useState("");
  const [customDate, setCustomDate] = useState(false);
  const [date, setDate] = useState();
  const [weekData, setWeekData] = useState([]);
  const [showWeekData, setShowWeekData] = useState(false);
  const { toast } = useToast();

  const handleClick = async () => {

    if(staffNo===""){
      toast({
        variant: "destructive",
        title: "Staff number missing",
        description: "Please enter staff number before proceeding.",
      });
      return;
    }
    setShowWeekData(false);

    // Determine the date to use
    const tempDate = customDate && date ? new Date(date) : new Date();
    const formattedDate = formatLocalDate(tempDate);

    try {
      const res = await fetch('/api/fetchWeekData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memno: staffNo, date: formattedDate })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error('Failed to fetch week data');
      }
      
      const parsedWeekData = JSON.parse(data.weekData);
      if (Array.isArray(parsedWeekData.weekData)) {
          setWeekData(parsedWeekData.weekData);
          setShowWeekData(true);
          console.log("Processing done and data stored")
      } else {
          console.error('The parsed weekData is not an array:', parsedWeekData.weekData);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDataReset = ()=>{
    setShowWeekData(false);
    setWeekData([]);
  }

  return (
    <div className="p-4 space-y-2">
      <div>

      </div>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
        <span className="text-[18px]">Please enter your staff number:</span>
        <Input value={staffNo} onChange={(e) => setStaffNo(e.target.value)} className="max-w-[300px]" />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="terms" checked={customDate} onCheckedChange={setCustomDate} />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Want to see previous week's data??
          </label>
          <p className="text-sm text-muted-foreground">
            Kindly choose any date for the week whose details you want to see.
          </p>
        </div>
      </div>

      {customDate &&
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      }

      <div className="space-x-2">
        <Button onClick={handleClick}>Get Hours</Button>
        <Button onClick={handleDataReset}>Reset Data</Button>
      </div>

      {showWeekData&&
        <HoursTable hoursdata={weekData}/>
      }
    </div>
  );
}
