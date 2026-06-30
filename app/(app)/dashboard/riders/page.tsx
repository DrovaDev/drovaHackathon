"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MaterialIcon from "@/components/ui/material-icon"

type RiderAvailability = "Available" | "On Delivery" | "Offline"

interface Rider {
  id: string
  name: string
  phone: string
  email: string
  vehicle: string
  vehicleIcon: string
  availability: RiderAvailability
  totalDeliveries: number
  completionRate: number
  rating: number
  earnings: string
  joinedAt: string
  bankName?: string
}

const mockRiders: Rider[] = [
  { id: "RID-001", name: "Chukwuemeka Dike", phone: "08012345678", email: "c.dike@email.com", vehicle: "Motorcycle", vehicleIcon: "two_wheeler", availability: "On Delivery", totalDeliveries: 184, completionRate: 97, rating: 4.8, earnings: "₦42,000", joinedAt: "Jan 2026", bankName: "First Bank" },
  { id: "RID-002", name: "Akin Joseph", phone: "08098765432", email: "akin.j@email.com", vehicle: "Motorcycle", vehicleIcon: "two_wheeler", availability: "On Delivery", totalDeliveries: 231, completionRate: 99, rating: 4.9, earnings: "₦61,500", joinedAt: "Nov 2025", bankName: "GTBank" },
  { id: "RID-003", name: "Femi Ade", phone: "07012345678", email: "femi.ade@email.com", vehicle: "Van", vehicleIcon: "airport_shuttle", availability: "Available", totalDeliveries: 98, completionRate: 94, rating: 4.5, earnings: "₦28,000", joinedAt: "Mar 2026", bankName: "Access Bank" },
  { id: "RID-004", name: "David Okoye", phone: "08133456789", email: "d.okoye@email.com", vehicle: "Electric Moped", vehicleIcon: "electric_moped", availability: "Available", totalDeliveries: 156, completionRate: 96, rating: 4.7, earnings: "₦37,200", joinedAt: "Feb 2026", bankName: "Zenith Bank" },
  { id: "RID-005", name: "Sola Badmus", phone: "09012345678", email: "sola.b@email.com", vehicle: "Motorcycle", vehicleIcon: "two_wheeler", availability: "Available", totalDeliveries: 72, completionRate: 92, rating: 4.3, earnings: "₦19,800", joinedAt: "May 2026", bankName: "UBA" },
  { id: "RID-006", name: "Yusuf Musa", phone: "08077654321", email: "y.musa@email.com", vehicle: "Motorcycle", vehicleIcon: "two_wheeler", availability: "Offline", totalDeliveries: 310, completionRate: 98, rating: 4.9, earnings: "₦78,000", joinedAt: "Aug 2025", bankName: "First Bank" },
  { id: "RID-007", name: "Grace Nwosu", phone: "07033456789", email: "grace.n@email.com", vehicle: "Electric Moped", vehicleIcon: "electric_moped", availability: "Available", totalDeliveries: 44, completionRate: 89, rating: 4.2, earnings: "₦11,000", joinedAt: "Jun 2026", bankName: "Kuda Bank" },
  { id: "RID-008", name: "Emeka Eze", phone: "08166543210", email: "emeka.e@email.com", vehicle: "Van", vehicleIcon: "airport_shuttle", availability: "Offline", totalDeliveries: 67, completionRate: 91, rating: 4.4, earnings: "₦22,500", joinedAt: "Apr 2026", bankName: "Sterling Bank" },
]

const availabilityConfig: Record<RiderAvailability, { bg: string; text: string; dot: string }> = {
  Available: { bg: "bg-secondary/10", text: "text-secondary-two", dot: "bg-secondary" },
  "On Delivery": { bg: "bg-primary/10", text: "text-primary", dot: "bg-primary" },
  Offline: { bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" },
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <MaterialIcon
          key={i}
          name="star"
          size={12}
          color={i <= Math.round(rating) ? "#D97706" : "var(--border)"}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating}</span>
    </div>
  )
}

export default function RidersPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<RiderAvailability | "ALL">("ALL")
  const [inviteModal, setInviteModal] = useState(false)
  const [inviteInput, setInviteInput] = useState("")
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null)

  const filtered = mockRiders.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.phone.includes(search) || r.vehicle.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "ALL" || r.availability === filter
    return matchSearch && matchFilter
  })

  const available = mockRiders.filter(r => r.availability === "Available").length
  const onDelivery = mockRiders.filter(r => r.availability === "On Delivery").length
  const offline = mockRiders.filter(r => r.availability === "Offline").length

  return (
    <div className="px-6 lg:px-10 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Rider Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Onboard, monitor, and manage your delivery fleet</p>
        </div>
        <Button onClick={() => setInviteModal(true)} className="gap-2">
          <MaterialIcon name="person_add" size={16} color="white" />
          Invite Rider
        </Button>
      </div>

      {/* Fleet summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Riders", value: mockRiders.length, icon: "group", bg: "bg-primary/5", color: "var(--primary)" },
          { label: "Available", value: available, icon: "check_circle", bg: "bg-secondary/10", color: "var(--secondary)" },
          { label: "On Delivery", value: onDelivery, icon: "local_shipping", bg: "bg-primary/5", color: "var(--primary)" },
          { label: "Offline", value: offline, icon: "wifi_off", bg: "bg-gray-100", color: "#6B7280" },
        ].map(s => (
          <div key={s.label} className="bg-popover rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
              <MaterialIcon name={s.icon} size={20} color={s.color} />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-primary">{s.value}</div>
              <div className="text-xs text-muted-foreground font-medium">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Input
            placeholder="Search by name, phone, or vehicle..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-silver-two border-0 focus-visible:ring-secondary"
          />
        </div>
        <div className="flex gap-2">
          {(["ALL", "Available", "On Delivery", "Offline"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border transition-colors ${filter === f ? "bg-primary text-white border-primary" : "bg-popover text-muted-foreground border-border hover:border-primary/40"}`}
            >
              {f === "ALL" ? "All" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Rider grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(rider => {
          const avCfg = availabilityConfig[rider.availability]
          return (
            <div
              key={rider.id}
              onClick={() => setSelectedRider(rider)}
              className="bg-popover rounded-2xl border border-border p-5 cursor-pointer hover:border-secondary/40 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-extrabold text-primary">
                  {rider.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${avCfg.bg} ${avCfg.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${avCfg.dot}`} />
                  {rider.availability}
                </span>
              </div>

              <div className="mb-3">
                <div className="font-bold text-foreground text-sm">{rider.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{rider.phone}</div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <MaterialIcon name={rider.vehicleIcon} size={14} color="var(--muted-foreground)" />
                <span className="text-xs text-muted-foreground">{rider.vehicle}</span>
              </div>

              <StarRating rating={rider.rating} />

              <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Deliveries</div>
                  <div className="font-bold text-sm text-foreground">{rider.totalDeliveries}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Completion</div>
                  <div className="font-bold text-sm text-foreground">{rider.completionRate}%</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Pending Earnings</div>
                  <div className="font-bold text-sm text-primary">{rider.earnings}</div>
                </div>
                <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                  View
                </Button>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted-foreground text-sm">
            No riders found matching your search
          </div>
        )}
      </div>

      {/* Invite Rider Modal */}
      {inviteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-popover rounded-2xl border border-border p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-primary">Invite Rider</h3>
              <button onClick={() => setInviteModal(false)}>
                <MaterialIcon name="close" size={20} color="var(--muted-foreground)" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Enter the rider&apos;s phone number or email. They&apos;ll receive an invitation to join your fleet on the Drova Rider app.
            </p>
            <div className="space-y-3">
              <Input
                placeholder="Phone number or email address"
                value={inviteInput}
                onChange={e => setInviteInput(e.target.value)}
                className="bg-silver-two border-0 focus-visible:ring-secondary"
              />
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setInviteModal(false)}>Cancel</Button>
                <Button className="flex-1" disabled={!inviteInput} onClick={() => { setInviteModal(false); setInviteInput("") }}>
                  <MaterialIcon name="send" size={14} color="white" />
                  Send Invite
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rider Detail Modal */}
      {selectedRider && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-popover rounded-2xl border border-border p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-primary">Rider Profile</h3>
              <button onClick={() => setSelectedRider(null)}>
                <MaterialIcon name="close" size={20} color="var(--muted-foreground)" />
              </button>
            </div>

            {/* Profile header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-extrabold text-primary">
                {selectedRider.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div className="font-bold text-foreground text-lg">{selectedRider.name}</div>
                <div className="text-sm text-muted-foreground">{selectedRider.phone}</div>
                <StarRating rating={selectedRider.rating} />
              </div>
              <div className="ml-auto">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${availabilityConfig[selectedRider.availability].bg} ${availabilityConfig[selectedRider.availability].text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${availabilityConfig[selectedRider.availability].dot}`} />
                  {selectedRider.availability}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: "Vehicle", value: selectedRider.vehicle, icon: selectedRider.vehicleIcon },
                { label: "Joined", value: selectedRider.joinedAt, icon: "calendar_today" },
                { label: "Total Deliveries", value: selectedRider.totalDeliveries, icon: "local_shipping" },
                { label: "Completion Rate", value: `${selectedRider.completionRate}%`, icon: "verified" },
                { label: "Pending Earnings", value: selectedRider.earnings, icon: "payments" },
                { label: "Bank", value: selectedRider.bankName ?? "—", icon: "account_balance" },
              ].map(item => (
                <div key={item.label} className="bg-silver-two rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MaterialIcon name={item.icon} size={13} color="var(--muted-foreground)" />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">{item.label}</span>
                  </div>
                  <div className="font-bold text-sm text-foreground">{String(item.value)}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1 text-destructive hover:text-destructive" onClick={() => setSelectedRider(null)}>
                Suspend Rider
              </Button>
              <Button className="flex-1" onClick={() => setSelectedRider(null)}>
                <MaterialIcon name="account_balance_wallet" size={14} color="white" />
                Pay {selectedRider.earnings}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
