"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { rider, order } from "@/api/router"
import { RiderProfile } from "@/api/types/rider.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MaterialIcon from "@/components/ui/material-icon"
import Link from "next/link"
import { Quotation, QuotationStatus, mockQuotations, quotationStatusConfig } from "@/lib/mock-quotations"
import { toast } from "sonner"
import { AxiosError } from "axios"

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderStatus = "CONFIRMED" | "ASSIGNED" | "EN_ROUTE_PICKUP" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED" | "COMPLETED" | "DISPUTED" | "CANCELLED"

interface Order {
  id: string
  quotationId: string
  senderName: string
  pickupAddress: string
  deliveryAddress: string
  packageType: string
  assignedRider?: string
  status: OrderStatus
  amount: string
  nombaTxRef?: string
  createdAt: string
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockOrders: Order[] = [
  { id: "DRV-0042", quotationId: "QUO-006", senderName: "Blessing Eze", pickupAddress: "14 Ozumba Mbadiwe, VI", deliveryAddress: "16 Opebi Rd, Ikeja", packageType: "Documents", assignedRider: "Chukwuemeka D.", status: "IN_TRANSIT", amount: "₦7,500", nombaTxRef: "NMB-TXN-78432", createdAt: "2026-06-30 08:00" },
  { id: "DRV-0041", quotationId: "QUO-007", senderName: "Tunde Williams", pickupAddress: "5 Awolowo Way, Ikoyi", deliveryAddress: "Ikotun-Egbe, Lagos", packageType: "Electronics", assignedRider: "Akin Joseph", status: "PICKED_UP", amount: "₦12,000", nombaTxRef: "NMB-TXN-78431", createdAt: "2026-06-30 07:30" },
  { id: "DRV-0040", quotationId: "QUO-008", senderName: "Yetunde Adebayo", pickupAddress: "8 Marina, Lagos Island", deliveryAddress: "Ojodu-Berger, Lagos", packageType: "Fragile", status: "CONFIRMED", amount: "₦9,200", nombaTxRef: "NMB-TXN-78430", createdAt: "2026-06-30 07:00" },
  { id: "DRV-0039", quotationId: "QUO-009", senderName: "Kelechi Nnaji", pickupAddress: "2 Adeola Hopewell, VI", deliveryAddress: "Alimosho, Lagos", packageType: "Clothing", assignedRider: "Femi Ade", status: "DELIVERED", amount: "₦6,800", nombaTxRef: "NMB-TXN-78429", createdAt: "2026-06-29 15:00" },
  { id: "DRV-0038", quotationId: "QUO-010", senderName: "Musa Garba", pickupAddress: "20 Lagos-Badagry Exp, Festac", deliveryAddress: "Ipaja, Lagos", packageType: "Food Items", assignedRider: "David O.", status: "COMPLETED", amount: "₦5,500", nombaTxRef: "NMB-TXN-78428", createdAt: "2026-06-29 12:00" },
]

// ─── Status config ────────────────────────────────────────────────────────────

const orderStatusConfig: Record<OrderStatus, { label: string; bg: string; text: string; icon: string }> = {
  CONFIRMED: { label: "Confirmed", bg: "bg-blue-100", text: "text-blue-700", icon: "check_circle" },
  ASSIGNED: { label: "Assigned", bg: "bg-indigo-100", text: "text-indigo-700", icon: "assignment_ind" },
  EN_ROUTE_PICKUP: { label: "En Route", bg: "bg-orange-100", text: "text-orange-700", icon: "directions_bike" },
  PICKED_UP: { label: "Picked Up", bg: "bg-yellow-100", text: "text-yellow-700", icon: "inventory_2" },
  IN_TRANSIT: { label: "In Transit", bg: "bg-primary/10", text: "text-primary", icon: "local_shipping" },
  DELIVERED: { label: "Delivered", bg: "bg-secondary/10", text: "text-secondary-two", icon: "verified" },
  COMPLETED: { label: "Completed", bg: "bg-secondary/10", text: "text-secondary-two", icon: "task_alt" },
  DISPUTED: { label: "Disputed", bg: "bg-red-100", text: "text-red-600", icon: "flag" },
  CANCELLED: { label: "Cancelled", bg: "bg-gray-100", text: "text-gray-500", icon: "cancel" },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status, config }: { status: string; config: { label: string; bg: string; text: string } }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}

function QuotationsTab({ quotations }: { quotations: Quotation[] }) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<QuotationStatus | "ALL">("ALL")
  const [invoiceModal, setInvoiceModal] = useState<Quotation | null>(null)
  const [price, setPrice] = useState("")
  const [expiry, setExpiry] = useState("24")

  const filtered = quotations.filter(q => {
    const matchSearch = q.senderName.toLowerCase().includes(search.toLowerCase()) || q.id.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "ALL" || q.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <MaterialIcon name="search" size={18} color="var(--muted-foreground)" />
          <Input
            placeholder="Search quotations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-silver-two border-0 focus-visible:ring-secondary"
          />
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          </span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["ALL", "PENDING", "INVOICED", "EXPIRED"] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border transition-colors ${filter === s ? "bg-primary text-white border-primary" : "bg-popover text-muted-foreground border-border hover:border-primary/40"}`}
            >
              {s === "ALL" ? "All" : quotationStatusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-popover rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-silver-two border-b border-border">
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">ID</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Sender</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hidden md:table-cell">Pickup → Delivery</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hidden lg:table-cell">Package</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="text-center px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Details</th>
                <th className="text-right px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                    No quotations found
                  </td>
                </tr>
              )}
              {filtered.map(q => {
                const cfg = quotationStatusConfig[q.status]
                return (
                  <tr key={q.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs font-bold text-muted-foreground">{q.id}</td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-foreground">{q.senderName}</div>
                      <div className="text-xs text-muted-foreground">{q.senderEmail}</div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">{q.pickupAddress}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MaterialIcon name="arrow_downward" size={12} color="var(--secondary)" />
                        <span className="truncate max-w-[180px]">{q.deliveryAddress}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-medium">{q.packageType}</span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={q.status} config={cfg} />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Link href={`/dashboard/orders/${q.id}`}>
                        <Button size="sm" variant="ghost" className="text-primary">
                          <MaterialIcon name="visibility" size={14} color="var(--primary)" />
                          View Detail
                        </Button>
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {q.status === "PENDING" && (
                          <Button size="sm" onClick={() => { setInvoiceModal(q); setPrice("") }}>
                            Generate Invoice
                          </Button>
                        )}
                        {q.status === "INVOICED" && (
                          <a href={q.nombaPaymentLink} target="_blank" rel="noreferrer">
                            <Button size="sm" variant="secondary">
                              <MaterialIcon name="link" size={14} color="white" />
                              Payment Link
                            </Button>
                          </a>
                        )}
                        {q.status === "EXPIRED" && (
                          <Button size="sm" variant="ghost" className="text-muted-foreground">Cancelled</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Invoice Modal */}
      {invoiceModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-popover rounded-2xl border border-border p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-primary">Generate Invoice</h3>
              <button onClick={() => setInvoiceModal(null)} className="text-muted-foreground hover:text-foreground">
                <MaterialIcon name="close" size={20} color="var(--muted-foreground)" />
              </button>
            </div>
            <div className="space-y-1 mb-5 bg-silver-two rounded-xl p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-bold">Quotation</p>
              <p className="font-bold text-foreground">{invoiceModal.id} — {invoiceModal.senderName}</p>
              <p className="text-xs text-muted-foreground">{invoiceModal.pickupAddress} → {invoiceModal.deliveryAddress}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1.5">Delivery Fee (₦)</label>
                <Input
                  type="number"
                  placeholder="e.g. 7500"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="bg-silver-two border-0 focus-visible:ring-secondary"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1.5">Invoice Expiry</label>
                <div className="flex gap-2">
                  {["24", "48", "72"].map(h => (
                    <button
                      key={h}
                      onClick={() => setExpiry(h)}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${expiry === h ? "bg-primary text-white border-primary" : "bg-silver-two border-border text-muted-foreground hover:border-primary/40"}`}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-1">A Nomba payment link will be generated and sent to the customer via email and WhatsApp.</p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="ghost" className="flex-1" onClick={() => setInvoiceModal(null)}>Cancel</Button>
                <Button className="flex-1" disabled={!price}>
                  <MaterialIcon name="send" size={14} color="white" />
                  Send Invoice
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function OrdersTab({ orders }: { orders: Order[] }) {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL")
  const [assignModal, setAssignModal] = useState<Order | null>(null)
  const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null)

  const { data: ridersData, isLoading: isLoadingRiders } = rider.list.useQuery({
    enabled: !!assignModal,
  })

  const availableRiders = (ridersData?.data ?? []).filter(
    (r: RiderProfile) => r.availabilityStatus === "available"
  )

  const assignRiderMutation = order.assign.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order"] })
      toast.success("Rider assigned successfully")
      setAssignModal(null)
      setSelectedRiderId(null)
    },
    onError: (error: Error) => {
      const axiosError = error as AxiosError<{ message: string }>
      toast.error(axiosError.response?.data?.message || "Failed to assign rider")
    },
  })

  const filtered = orders.filter(o => {
    const matchSearch = o.senderName.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()) || (o.assignedRider ?? "").toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "ALL" || o.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Input
            placeholder="Search orders, riders..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-4 bg-silver-two border-0 focus-visible:ring-secondary"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["ALL", "CONFIRMED", "ASSIGNED", "IN_TRANSIT", "DELIVERED", "COMPLETED"] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border transition-colors ${filter === s ? "bg-primary text-white border-primary" : "bg-popover text-muted-foreground border-border hover:border-primary/40"}`}
            >
              {s === "ALL" ? "All" : orderStatusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-popover rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-silver-two border-b border-border">
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Order ID</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Sender</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hidden md:table-cell">Route</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hidden lg:table-cell">Rider</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Amount</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="text-right px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground text-sm">No orders found</td>
                </tr>
              )}
              {filtered.map(o => {
                const cfg = orderStatusConfig[o.status]
                return (
                  <tr key={o.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-mono text-xs font-bold text-muted-foreground">{o.id}</div>
                      {o.nombaTxRef && <div className="text-[10px] text-muted-foreground/60 mt-0.5">{o.nombaTxRef}</div>}
                    </td>
                    <td className="px-5 py-4 font-semibold text-foreground">{o.senderName}</td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="text-xs text-muted-foreground truncate max-w-[180px]">{o.pickupAddress}</div>
                      <div className="text-xs flex items-center gap-1 mt-0.5 text-muted-foreground">
                        <MaterialIcon name="arrow_downward" size={12} color="var(--secondary)" />
                        <span className="truncate max-w-[160px]">{o.deliveryAddress}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      {o.assignedRider ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                            <MaterialIcon name="person" size={14} color="var(--primary)" />
                          </div>
                          <span className="text-xs font-medium text-foreground">{o.assignedRider}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-bold text-primary">{o.amount}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${cfg.bg} ${cfg.text}`}>
                        <MaterialIcon name={cfg.icon} size={12} color="currentColor" />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {o.status === "CONFIRMED" && (
                        <Button size="sm" onClick={() => setAssignModal(o)}>
                          Assign Rider
                        </Button>
                      )}
                      {(o.status === "IN_TRANSIT" || o.status === "PICKED_UP" || o.status === "EN_ROUTE_PICKUP" || o.status === "ASSIGNED") && (
                        <Button size="sm" variant="ghost" className="text-primary">
                          <MaterialIcon name="visibility" size={14} color="var(--primary)" />
                          Track
                        </Button>
                      )}
                      {(o.status === "DELIVERED" || o.status === "COMPLETED") && (
                        <Button size="sm" variant="ghost" className="text-muted-foreground">
                          View Details
                        </Button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Rider Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-popover rounded-2xl border border-border p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-primary">Assign Rider</h3>
              <button onClick={() => { setAssignModal(null); setSelectedRiderId(null) }}>
                <MaterialIcon name="close" size={20} color="var(--muted-foreground)" />
              </button>
            </div>
            <div className="bg-silver-two rounded-xl p-4 mb-5">
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">Order</p>
              <p className="font-bold text-foreground">{assignModal.id} — {assignModal.senderName}</p>
            </div>
            <div className="space-y-2 mb-5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Available Riders</p>
              {isLoadingRiders ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-muted" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : availableRiders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No available riders at the moment
                </div>
              ) : (
                availableRiders.map((r: RiderProfile) => {
                  const riderName = `${r.firstName ?? ""} ${r.lastName ?? ""}`.trim() || "Unknown"
                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedRiderId(r.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                        selectedRiderId === r.id
                          ? "border-secondary bg-secondary/5"
                          : "border-border hover:border-secondary/40 hover:bg-secondary/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <MaterialIcon name="person" size={16} color="var(--primary)" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-foreground">{riderName}</span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{r.vehicleType}</span>
                            <span>·</span>
                            <span>{r.totalDeliveries ?? 0} deliveries</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          <MaterialIcon name="star" size={12} color="#D97706" />
                          <span className="text-xs font-bold">{r.rating}</span>
                        </div>
                        {selectedRiderId === r.id && (
                          <MaterialIcon name="check_circle" size={18} color="var(--secondary)" />
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => { setAssignModal(null); setSelectedRiderId(null) }}>Cancel</Button>
              <Button
                className="flex-1"
                disabled={!selectedRiderId || assignRiderMutation.isPending}
                onClick={() => {
                  if (!assignModal || !selectedRiderId) return
                  assignRiderMutation.mutate({ orderId: assignModal.id, riderId: selectedRiderId })
                }}
              >
                {assignRiderMutation.isPending ? "Assigning..." : "Confirm Assignment"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

function OrdersContent() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") === "orders" ? "orders" : "quotations"
  const [activeTab, setActiveTab] = useState<"quotations" | "orders">(initialTab)

  const pendingCount = mockQuotations.filter(q => q.status === "PENDING").length
  const activeOrdersCount = mockOrders.filter(o => !["DELIVERED", "COMPLETED", "CANCELLED", "DISPUTED"].includes(o.status)).length

  return (
    <div className="px-6 lg:px-10 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Orders</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage quotations and deliveries across the full lifecycle</p>
        </div>
      </div>

      {/* Stat summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Pending Quotations", value: pendingCount, icon: "receipt_long", color: "bg-amber-50", iconColor: "#D97706" },
          { label: "Invoiced", value: mockQuotations.filter(q => q.status === "INVOICED").length, icon: "description", color: "bg-blue-50", iconColor: "#2563EB" },
          { label: "Active Orders", value: activeOrdersCount, icon: "local_shipping", color: "bg-primary/5", iconColor: "var(--primary)" },
          { label: "Completed", value: mockOrders.filter(o => o.status === "COMPLETED").length, icon: "task_alt", color: "bg-secondary/10", iconColor: "var(--secondary)" },
        ].map(s => (
          <div key={s.label} className="bg-popover rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
              <MaterialIcon name={s.icon} size={20} color={s.iconColor} />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-primary">{s.value}</div>
              <div className="text-xs text-muted-foreground font-medium">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-border flex gap-0">
        <button
          onClick={() => setActiveTab("quotations")}
          className={`relative px-5 py-3 text-sm font-bold transition-colors border-b-2 ${activeTab === "quotations" ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"}`}
        >
          Quotations
          {pendingCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`relative px-5 py-3 text-sm font-bold transition-colors border-b-2 ${activeTab === "orders" ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"}`}
        >
          Orders
          {activeOrdersCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-black">
              {activeOrdersCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "quotations" ? (
        <QuotationsTab quotations={mockQuotations} />
      ) : (
        <OrdersTab orders={mockOrders} />
      )}
    </div>
  )
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="px-6 py-8 text-muted-foreground text-sm">Loading...</div>}>
      <OrdersContent />
    </Suspense>
  )
}
