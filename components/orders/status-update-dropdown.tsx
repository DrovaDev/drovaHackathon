"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import MaterialIcon from "@/components/ui/material-icon"
import { Button } from "@/components/ui/button"
type OrderStatus = "Pending" | "Assigned" | "In-Transit" | "Delivered" | "Cancelled"

const statusOptions: OrderStatus[] = ["Pending", "Assigned", "In-Transit", "Delivered", "Cancelled"]

type Props = {
  currentStatus: OrderStatus
  onStatusChange: (status: OrderStatus) => void
  disabled?: boolean
}

export function StatusUpdateDropdown({ currentStatus, onStatusChange, disabled }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        variant="default"
        size="default"
        onClick={() => setOpen(!open)}
        disabled={disabled}
      >
        <MaterialIcon name="edit" size={16} color={disabled ? undefined : "var(--primary-foreground)"} />
        Update Status
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-xl shadow-xl z-20 py-1 overflow-hidden">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => {
                  onStatusChange(status)
                  setOpen(false)
                }}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-silver-two transition-colors flex items-center space-x-2",
                  currentStatus === status && "bg-secondary/5"
                )}
              >
                <span className={cn("w-2 h-2 rounded-full", currentStatus === status && "bg-secondary")} />
                <span>{status}</span>
                {currentStatus === status && (
                  <MaterialIcon name="check" size={14} color="var(--secondary)" className="ml-auto" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
