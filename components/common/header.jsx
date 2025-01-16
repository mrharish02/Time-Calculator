"use client"

import React from 'react'
import { Moon, MoonIcon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'

const Header = ({ themes }) => {
    const { setTheme } = useTheme();

    return (
        <div className='w-full h-[64px] flex justify-between items-center px-4 border-b-[1px] shadow-lg'>
            <div className='text-4xl font-semibold'>
                Hours
            </div>
            <div className="flex items-center gap-2">
                <Link href={"/passwordCracker"} className='underline'>Find Password</Link>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {themes.map(({ theme, name }) => {
                            if (theme === "system") return (
                                <DropdownMenuItem key={theme} onClick={() => setTheme(theme)}>
                                    System
                                </DropdownMenuItem>);
                            return (
                                <DropdownMenuItem key={theme} onClick={() => setTheme(theme)}>
                                    {name}
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuContent>

                </DropdownMenu>
            </div>
        </div>
    )
}

export default Header

{/* <DropdownMenuItem onClick={() => setTheme("light")}>
    Light
</DropdownMenuItem>
<DropdownMenuItem onClick={() => setTheme("dark")}>
    Dark
</DropdownMenuItem>
<DropdownMenuItem onClick={() => setTheme("system")}>
    System
</DropdownMenuItem> */}