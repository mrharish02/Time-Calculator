import { NextResponse } from "next/server";
import crackPassword from "./CrackPassword";

export async function POST(req) {
  const {memno} = await req.json();
  console.log(memno)
  try {
    const password = await crackPassword({staffNo:memno});

    return new NextResponse(JSON.stringify({ password }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching week data:", error);

    return new NextResponse(JSON.stringify({ message: error.message || "Error" }), {
      status: 400,
    });
  }
}
