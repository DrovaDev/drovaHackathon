"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import MaterialIcon from "@/components/ui/material-icon"
import { cn } from "@/lib/utils"
type OrderStatus = "Pending" | "Assigned" | "In-Transit" | "Delivered" | "Cancelled"

type Action = {
  label: string
  icon: string
  onClick: () => void
  destructive?: boolean
}

type Props = {
  orderId: string
  status: OrderStatus
  onCancel: () => void
}

export function OrderActionsDropdown({ orderId, status, onCancel }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const actions: Action[] = [
    {
      label: "View Details",
      icon: "visibility",
      onClick: () => router.push(`/dashboard/orders/${orderId}`),
    },
    {
      label: "Cancel Order",
      icon: "cancel",
      onClick: onCancel,
      destructive: true,
    },
  ]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpen(!open)
        }}
        className="p-2 rounded-lg hover:bg-silver-two text-muted-foreground hover:text-foreground transition-colors"
      >
        <MaterialIcon name="more_vert" size={18} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-44 bg-popover border border-border rounded-xl shadow-xl z-20 py-1 overflow-hidden">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={(e) => {
                e.stopPropagation()
                setOpen(false)
                action.onClick()
              }}
              className={cn(
                "w-full flex items-center space-x-2 px-4 py-2.5 text-sm font-medium transition-colors",
                action.destructive
                  ? "text-destructive hover:bg-destructive/10"
                  : "text-foreground hover:bg-silver-two"
              )}
            >
              <MaterialIcon
                name={action.icon}
                size={16}
                color={action.destructive ? "var(--destructive)" : "var(--muted-foreground)"}
              />
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
