"use client"

import { Moon, Sun, SunMoon } from "lucide-react"
import { useTheme } from "next-themes"

import {
    DropdownMenuCheckboxItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeMenuSub() {
    const { theme, setTheme } = useTheme()

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <SunMoon className="mr-2 h-4 w-4" />
                Tema
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent alignOffset={-6}>
                <DropdownMenuCheckboxItem
                    checked={theme === "light"}
                    onSelect={(e) => {
                        e.preventDefault()
                        setTheme("light")
                    }}
                >
                    <Sun className="mr-2 h-4 w-4" />
                    Claro
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={theme === "dark"}
                    onSelect={(e) => {
                        e.preventDefault()
                        setTheme("dark")
                    }}
                >
                    <Moon className="mr-2 h-4 w-4" />
                    Escuro
                </DropdownMenuCheckboxItem>
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    )
}
