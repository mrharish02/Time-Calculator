import { NextResponse } from "next/server";
import fetchWeekData from "./TimeDetails";

export async function POST(req) {
  const {memno,date} = await req.json();
  try {
    // const weekData1 = await fetchWeekData({staffNo:memno,date});
    let weekData = '{\n    "weekData": [\n        {\n            "Emp_nmbr": "6305",\n            "Log Date": "13/01/2025 08:28:33",\n            "Device id": "aasdF3"\n        },\n        {\n            "Emp_nmbr": "6305",\n            "Log Date": "13/01/2025 18:07:10",\n            "Device id": "aasdF3"\n        },\n        {\n            "Emp_nmbr": "6305",\n            "Log Date": "14/01/2025 08:36:25",\n            "Device id": "aasdF3"\n        },\n        {\n            "Emp_nmbr": "6305",\n            "Log Date": "14/01/2025 16:52:14",\n            "Device id": "aasdF3"\n        },\n        {\n            "Emp_nmbr": "6305",\n            "Log Date": "15/01/2025 08:51:27",\n            "Device id": "aasdF3"\n        },\n        {\n            "Emp_nmbr": "6305",\n            "Log Date": "15/01/2025 17:52:03",\n            "Device id": "aasdF3"\n        },\n        {\n            "Emp_nmbr": "6305",\n            "Log Date": "16/01/2025 09:00:00",\n            "Device id": "aasdF3",\n            "MetaData": "Future"\n        },\n        {\n            "Emp_nmbr": "6305",\n            "Log Date": "16/01/2025 17:00:00",\n            "Device id": "aasdF3",\n            "MetaData": "Future"\n        },\n        {\n            "Emp_nmbr": "6305",\n            "Log Date": "17/01/2025 09:00:00",\n            "Device id": "aasdF3",\n            "MetaData": "Future"\n        },\n        {\n            "Emp_nmbr": "6305",\n            "Log Date": "17/01/2025 17:00:00",\n            "Device id": "aasdF3",\n            "MetaData": "Future"\n        }\n    ]\n}'

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
