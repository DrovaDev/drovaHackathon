"use client"

import { cn } from "@/lib/utils"
import MaterialIcon from "@/components/ui/material-icon"
import { Button } from "@/components/ui/button"
type OrderStatus = "Pending" | "Assigned" | "In-Transit" | "Delivered" | "Cancelled"

export type DateRange = "all" | "today" | "7days" | "30days"
export type SortOption = "date-desc" | "date-asc" | "amount-desc" | "amount-asc"

type Props = {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: OrderStatus | "All"
  onStatusChange: (status: OrderStatus | "All") => void
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  resultCount: number
  totalCount: number
  onCreateClick: () => void
}

const ALL_STATUSES: (OrderStatus | "All")[] = ["All", "Pending", "Assigned", "In-Transit", "Delivered", "Cancelled"]

const DATE_RANGES: { value: DateRange; label: string }[] = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
]

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "amount-desc", label: "Highest Amount" },
  { value: "amount-asc", label: "Lowest Amount" },
]

export function OrderFilters({
  searchQuery, onSearchChange,
  statusFilter, onStatusChange,
  dateRange, onDateRangeChange,
  sortBy, onSortChange,
  resultCount, totalCount,
  onCreateClick,
}: Props) {
  const hasActiveFilters = statusFilter !== "All" || dateRange !== "all" || sortBy !== "date-desc"

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full max-w-xs">
            <MaterialIcon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Order ID, Customer..."
              className="w-full pl-10 pr-4 py-2 bg-silver-two border-border rounded-lg text-sm focus-visible:ring-secondary/20 focus-visible:border-secondary outline-none transition-all"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value as OrderStatus | "All")}
              className="h-9 appearance-none bg-silver-two border border-border rounded-lg pl-3 pr-8 py-1 text-sm font-medium text-foreground cursor-pointer hover:bg-border/30 transition-colors outline-none focus-visible:ring-secondary/20 focus-visible:border-secondary"
            >
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
              ))}
            </select>
            <MaterialIcon name="expand_more" size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => onDateRangeChange(e.target.value as DateRange)}
              className="h-9 appearance-none bg-silver-two border border-border rounded-lg pl-3 pr-8 py-1 text-sm font-medium text-foreground cursor-pointer hover:bg-border/30 transition-colors outline-none focus-visible:ring-secondary/20 focus-visible:border-secondary"
            >
              {DATE_RANGES.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
            <MaterialIcon name="expand_more" size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="h-9 appearance-none bg-silver-two border border-border rounded-lg pl-3 pr-8 py-1 text-sm font-medium text-foreground cursor-pointer hover:bg-border/30 transition-colors outline-none focus-visible:ring-secondary/20 focus-visible:border-secondary"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <MaterialIcon name="expand_more" size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <Button variant="default" size="default" onClick={onCreateClick} className="shrink-0">
          <MaterialIcon name="add" size={16} color="var(--primary-foreground)" />
          Create New Order
        </Button>
      </div>

      {(hasActiveFilters || searchQuery) && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-bold text-foreground">{resultCount}</span> of {totalCount} orders
            {hasActiveFilters && (
              <button
                onClick={() => {
                  onStatusChange("All")
                  onDateRangeChange("all")
                  onSortChange("date-desc")
                  onSearchChange("")
                }}
                className="ml-3 text-secondary font-bold hover:underline"
              >
                Clear filters
              </button>
            )}
          </p>
        </div>
      )}
    </div>
  )
}
