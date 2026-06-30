"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import MaterialIcon from "@/components/ui/material-icon"
import { cn } from "@/lib/utils"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import { OrderActionsDropdown } from "@/components/orders/order-actions-dropdown"
type OrderStatus = "Pending" | "Assigned" | "In-Transit" | "Delivered" | "Cancelled"
type Order = {
  id: string; customerName: string; initials: string; location: string
  status: OrderStatus; createdAt: string; createdTime: string; amount: string
  notes: unknown[]; timeline: unknown[]
  pickupAddress: string; deliveryAddress: string; packageType: string
  quantity: number; customerPhone: string; customerEmail: string
  packageWeight: string; insurance: string; specialInstructions: string; scheduledPickup: string
}

const ITEMS_PER_PAGE = 4

type Props = {
  orders: Order[]
  onCancel: (orderId: string) => void
}

export function OrderTable({ orders, onCancel }: Props) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage(1)
  }, [orders.length])

  const totalPages = Math.max(1, Math.ceil(orders.length / ITEMS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)

  const paginatedOrders = useMemo(
    () => orders.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE),
    [orders, safePage]
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (orders.length === 0) {
    return (
      <div className="bg-popover rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-16 text-center">
          <MaterialIcon name="search_off" size={40} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No orders found</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Try a different search term or create your first order to get started.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-popover rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-silver-two">
              {["Order ID", "Customer", "Status", "Date", "Amount", ""].map((h) => (
                <th
                  key={h}
                  className={cn(
                    "px-6 py-4 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest",
                    h === "Amount" && "text-right",
                    h === "" && "w-16 text-center"
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedOrders.map((order) => {
              const isCancelled = order.status === "Cancelled"
              return (
                <tr
                  key={order.id}
                  className={cn(
                    "transition-colors cursor-pointer",
                    isCancelled ? "opacity-50" : "hover:bg-silver-two/50"
                  )}
                  onClick={() => !isCancelled && router.push(`/dashboard/orders/${order.id}`)}
                >
                  <td className="px-6 py-5">
                    <span className={cn("font-bold", isCancelled ? "text-muted-foreground" : "text-primary")}>
                      #{order.id}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-silver-two flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                        {order.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{order.customerName}</p>
                        <p className="text-[10px] text-muted-foreground">{order.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-foreground">{order.createdAt}</p>
                    <p className="text-[10px] text-muted-foreground">{order.createdTime}</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <p className={cn("text-sm font-extrabold", isCancelled ? "text-muted-foreground" : "text-primary")}>
                      {order.amount}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <OrderActionsDropdown
                      orderId={order.id}
                      status={order.status}
                      onCancel={() => onCancel(order.id)}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {orders.length > ITEMS_PER_PAGE && (
        <div className="px-6 py-4 flex items-center justify-between bg-silver-two/30 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-bold text-foreground">{(safePage - 1) * ITEMS_PER_PAGE + 1}</span>
            {"-"}
            <span className="font-bold text-foreground">{Math.min(safePage * ITEMS_PER_PAGE, orders.length)}</span> of{" "}
            <span className="font-bold text-foreground">{orders.length}</span> orders
          </p>
          <div className="flex items-center space-x-2">
            <button
              className="w-8 h-8 rounded-lg hover:bg-silver-two text-muted-foreground disabled:opacity-30 flex items-center justify-center"
              disabled={safePage <= 1}
              onClick={() => handlePageChange(safePage - 1)}
            >
              <MaterialIcon name="chevron_left" size={20} />
            </button>
            {generatePageNumbers(safePage, totalPages).map((p, idx) =>
              p === "..." ? (
                <span key={`ellipsis-${idx}`} className="text-muted-foreground text-xs px-1">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => handlePageChange(p as number)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-bold transition-colors",
                    safePage === p
                      ? "bg-primary text-white"
                      : "hover:bg-silver-two text-muted-foreground"
                  )}
                >
                  {p}
                </button>
              )
            )}
            <button
              className="w-8 h-8 rounded-lg hover:bg-silver-two text-muted-foreground disabled:opacity-30 flex items-center justify-center"
              disabled={safePage >= totalPages}
              onClick={() => handlePageChange(safePage + 1)}
            >
              <MaterialIcon name="chevron_right" size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function generatePageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | "...")[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) pages.push("...")
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push("...")
  if (total > 1) pages.push(total)

  return pages
}
