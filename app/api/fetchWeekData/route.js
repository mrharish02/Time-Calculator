import { NextResponse } from "next/server";
import fetchWeekData from "./TimeDetails";

export async function POST(req) {
  const {memno,date} = await req.json();
  try {
    const weekData = await fetchWeekData({staffNo:memno,date});
    let weekData1 = {"weekData" : [
      {
          "Emp_nmbr": "6305",
          "Log Date": "13/01/2025 08:28:33",
          "Device id": "aasdF3"
      },
      {
          "Emp_nmbr": "6305",
          "Log Date": "13/01/2025 18:07:10",
          "Device id": "aasdF3"
      },
      {
          "Emp_nmbr": "6305",
          "Log Date": "14/01/2025 08:36:25",
          "Device id": "aasdF3"
      },
      {
          "Emp_nmbr": "6305",
          "Log Date": "15/01/2025 09:00:00",
          "Device id": "aasdF3",
          "MetaData": "future"
      },
      {
          "Emp_nmbr": "6305",
          "Log Date": "15/01/2025 17:00:00",
          "Device id": "aasdF3",
          "MetaData": "future"
      },
      {
          "Emp_nmbr": "6305",
          "Log Date": "16/01/2025 09:00:00",
          "Device id": "aasdF3",
          "MetaData": "future"
      },
      {
          "Emp_nmbr": "6305",
          "Log Date": "16/01/2025 17:00:00",
          "Device id": "aasdF3",
          "MetaData": "future"
      },
      {
          "Emp_nmbr": "6305",
          "Log Date": "17/01/2025 09:00:00",
          "Device id": "aasdF3",
          "MetaData": "future"
      },
      {
          "Emp_nmbr": "6305",
          "Log Date": "17/01/2025 17:00:00",
          "Device id": "aasdF3",
          "MetaData": "future"
      }
  ]}

    return new NextResponse(JSON.stringify({ weekData }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching week data:", error);

    return new NextResponse(JSON.stringify({ message: error.message || "Error" }), {
      status: 400,
    });
  }
}
