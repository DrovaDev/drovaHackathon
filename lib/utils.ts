import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const muiOpts=(
  color = '#000',
  size = 24,
)=>{
    return { fontSize: `${size}px`, color: `${color}` }
}

