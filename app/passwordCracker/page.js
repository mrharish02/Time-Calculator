"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react'

const PasswordCracker = () => {
  const [staffNo, setStaffNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    try {
      const res = await fetch('/api/crackPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memno: staffNo })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error('Failed to crack password');
      }
      
      console.log(data)
      setPassword(data.password)

    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setLoading(false);
  };
  
  return (
    <div className='p-4 space-y-2'>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
        <span className="text-[18px]">Please enter your staff number:</span>
        <Input value={staffNo} onChange={(e) => setStaffNo(e.target.value)} className="max-w-[300px]" />
      </div>

      <div className="space-x-2">
        <Button onClick={handleClick}>Get Password</Button>
      </div>

      <div>
        {loading&& <span><Loader2 className='animate-spin'/> Cracking your password </span>}
      {password !== "" && password.length === 4 && (
          <span>Your password is {password}</span>
      )}
      </div>
    </div>
  )
}

export default PasswordCracker