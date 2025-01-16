import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react";
import { HoursChart } from "./HoursChart";

const processData = (data) => {
    // Helper function to format the date part of Log Date (ignoring time)
    const getDatePart = (logDate) => logDate.split(' ')[0];

    // Helper function to convert "DD/MM/YYYY HH:mm:ss" to "YYYY-MM-DDTHH:mm:ss"
    const reformatDate = (logDate) => {
        const [date, time] = logDate.split(' ');
        const [day, month, year] = date.split('/');
        return `${year}-${month}-${day}T${time}`; // Convert to valid ISO format
    };

    const calculateDuration = (inTime, outTime) => {
        const inDate = new Date(reformatDate(inTime));
        const outDate = new Date(reformatDate(outTime));
        const durationInMillis = outDate - inDate; // Difference in milliseconds
        
        // Convert duration to minutes
        const durationInMinutes = Math.floor(durationInMillis / 60000); // Convert to minutes
        
        // Calculate hours and minutes
        const hours = Math.floor(durationInMinutes / 60); // Get whole hours
        const minutes = durationInMinutes % 60; // Get remaining minutes
    
        return {durationInMinutes, hours:{ hours, minutes }}; // Return as an object with hours and minutes
    };

    // Step 1: Group data by date
    const groupedData = data.reduce((acc, entry) => {
        const date = getDatePart(entry["Log Date"]);
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(entry);
        return acc;
    }, {});

    // Step 2: Pair "in" and "out" for each date and calculate duration
    const pairedData = [];
    for (let date in groupedData) {
        const logs = groupedData[date];
        for (let i = 0; i < logs.length; i += 2) {
            const inData = logs[i]; // First log (in)
            const outData = logs[i + 1] || {}; // Second log (out)

            // Calculate duration between "in" and "out"
            const duration = outData["Log Date"] ? calculateDuration(inData["Log Date"], outData["Log Date"]) : null;

            // Create a new object with "in" and "out" logs combined
            pairedData.push({
                Emp_nmbr: inData.Emp_nmbr,
                LogDate: date,
                DeviceId: inData["Device id"],
                In: inData["Log Date"],
                Out: outData["Log Date"] || null,
                MetaData: inData.MetaData || outData.MetaData || null,
                Duration: duration.hours, // Add duration field
                TotalMinutes: duration.durationInMinutes,
                FormattedDate: `${duration.hours.hours} Hr ${duration.hours.minutes} min`
            });
        }
    }

    return pairedData;
};

const parseTime = (dateStr) => {
    // Split the date and time parts
    const [datePart, timePart] = dateStr.split(' ');

    // Split the date part into day, month, and year
    const [day, month, year] = datePart.split('/').map(num => parseInt(num, 10));

    // Split the time part into hours, minutes, and seconds
    const [hours, minutes, seconds] = timePart.split(':').map(num => parseInt(num, 10));

    // Construct a Date object using the parsed values
    const date = new Date(year, month - 1, day, hours, minutes, seconds);

    // Format the time as 12-hour AM/PM format
    const period = hours >= 12 ? 'PM' : 'AM';
    const hourIn12 = hours % 12 || 12; // Convert 0 hour to 12
    // const formattedTime = `${hourIn12}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`;
    const formattedTime = `${hourIn12}:${minutes.toString().padStart(2, '0')} ${period}`;

    return formattedTime;
};


export function HoursTable({ hoursdata }) {
    const [totalDuration,setTotalDuration] = useState();
    const formattedHoursData = processData(hoursdata);
    console.log("result", formattedHoursData);

    useEffect(() => {
        let totalHours = 0;
        let totalMinutes = 0;

        // Accumulate total duration from all the entries
        formattedHoursData.forEach((entry) => {
            if (entry.Duration) {
                totalHours += entry.Duration.hours;
                totalMinutes += entry.Duration.minutes;
            }
        });

        // Adjust total minutes to fit within hours (e.g., 130 minutes becomes 2 hours 10 minutes)
        totalHours += Math.floor(totalMinutes / 60);
        totalMinutes = totalMinutes % 60;

        setTotalDuration({ hours: totalHours, minutes: totalMinutes });
    }, []);

    return (
        <>
        <Table>
            {/* <TableCaption>A list of your recent</TableCaption> */}
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead className="text-center">In</TableHead>
                    <TableHead className="text-center">Out</TableHead>
                    <TableHead className="text-center">Hours</TableHead>
                    <TableHead className="text-center">Remarks</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {formattedHoursData.map((day) => (
                    // <TableRow key={day.LogDate} className={`${day.MetaData=="Future"?"bg-blue-300 hover:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-700": day.MetaData=="Absent"?"bg-red-300 hover:bg-red-400 dark:bg-red-500 dark:hover:bg-red-700":"bg-green-300 hover:bg-green-400 dark:bg-green-500 dark:hover:bg-green-700"}`}>
                    <TableRow key={day.LogDate}>
                        <TableCell className="font-medium">{day.LogDate}</TableCell>
                        <TableCell className="text-center">{parseTime(day.In)}</TableCell>
                        <TableCell className="text-center">{parseTime(day.Out)}</TableCell>
                        <TableCell className="text-center">{day.Duration.hours} Hr, {day.Duration.minutes} min</TableCell>
                        <TableCell className="text-center">{day.MetaData || "Present"}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={4}>Total hours</TableCell>
                    <TableCell className="text-center">{totalDuration?.hours||0} Hr, {totalDuration?.minutes||0} min</TableCell>
                    {/* <TableCell colSpan={1}></TableCell> */}
                </TableRow>
            </TableFooter>
        </Table>
        <HoursChart data={formattedHoursData}/>
        </>
    )
}