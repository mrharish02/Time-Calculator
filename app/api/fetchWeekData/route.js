import { NextResponse } from "next/server";
import fetchWeekData from "./TimeDetails";

export async function POST(req) {
  try {
    const weekData = await fetchWeekData();
        console.log("Week Data:", weekData);

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
