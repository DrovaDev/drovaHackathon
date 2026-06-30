"use client"

import { useState, useRef, useEffect } from "react"
import { DropdownOption } from "@/types/componentsTypes"
import { motion,AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"


type DropDownProp={
    options: DropdownOption[],
    setterFunc: (value:DropdownOption)=>void
}

const Dropdown = ({options,setterFunc}:DropDownProp) => {
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState<DropdownOption | null>(options[0] ?? null)

    const dropdownRef = useRef<HTMLDivElement>(null)

    // close when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!dropdownRef.current?.contains(e.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelect = (option: DropdownOption) => {
        setSelected(option)
        setterFunc(option)
        setOpen(false)
    }

    return (
        <div ref={dropdownRef} className="relative w-full bg-white text-muted-foreground">

            {/* Trigger */}
            <button
                onClick={() => setOpen(prev => !prev)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-[5px] text-sm font-medium border-[0.8px] border-border"
            >
                {selected?.label}
                <span className={`transition-transform ${open ? "rotate-180" : ""}`}>
                    <ChevronDown color="#506b5b"/>
                </span>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute mt-2 w-full rounded-[5px] bg-white border border-border shadow-lg overflow-hidden z-50"
                    >
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => handleSelect(option)}
                                className="px-4 py-3 text-sm cursor-pointer hover:bg-silver-two"
                            >
                                {option.label}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Dropdown;