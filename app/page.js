"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  
  const handleClick = async () => {
    console.log("clicked fetch week data function");

    try {
      const res = await fetch('/api/fetchWeekData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch week data');
      }

      const data = await res.json();
      console.log("response", data.weekData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="p-4 space-y-2">
      <Input/>
      <Button onClick={handleClick}>Get Hours</Button>
    </div>
  );
}
