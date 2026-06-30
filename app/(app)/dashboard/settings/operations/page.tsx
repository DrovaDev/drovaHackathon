"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectPopup, SelectItem } from "@/components/ui/select"
import MaterialIcon from "@/components/ui/material-icon"

const vehicles = [
  { id: "motorcycle", label: "Motorcycle", desc: "Fast, Urban delivery", icon: "motorcycle" },
  { id: "van", label: "Van", desc: "Heavy cargo, Multi-stop", icon: "airport_shuttle" },
  { id: "moped", label: "Electric Moped", desc: "Eco-friendly, Silent", icon: "moped" },
]

export default function OperationsPage() {
  const [scope, setScope] = useState("intracity")
  const [zones, setZones] = useState(["Victoria Island", "Ikeja", "Lekki"])
  const [selectedVehicles, setSelectedVehicles] = useState(["motorcycle", "moped"])
  const [weekdayStart, setWeekdayStart] = useState("08:00")
  const [weekdayEnd, setWeekdayEnd] = useState("20:00")
  const [weekendStart, setWeekendStart] = useState("09:00")
  const [weekendEnd, setWeekendEnd] = useState("16:00")
  const [newZone, setNewZone] = useState("")

  const toggleVehicle = (id: string) => {
    setSelectedVehicles((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    )
  }

  const removeZone = (zone: string) => {
    setZones((prev) => prev.filter((z) => z !== zone))
  }

  const addZone = () => {
    if (newZone.trim() && !zones.includes(newZone.trim())) {
      setZones((prev) => [...prev, newZone.trim()])
      setNewZone("")
    }
  }

  return (
    <div className="p-12 max-w-5xl">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h3 className="text-4xl font-extrabold text-primary tracking-tight mb-2">Configure Logistics</h3>
          <p className="text-muted-foreground max-w-md">Define the operational boundaries and resource allocation for your fleet to ensure optimal delivery flow.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" className="text-primary font-bold hover:bg-silver-two">Discard Changes</Button>
          <Button>Save Changes</Button>
        </div>
      </div>

      <div className="space-y-12">
        {/* Delivery Scope */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-primary">Delivery Scope</h4>
            <p className="text-sm text-muted-foreground">Specify the geographical reach of your current logistics infrastructure.</p>
          </div>
          <div className="md:col-span-2">
            <div className="relative group">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 ml-1">Expansion Range</label>
              <Select value={scope} onValueChange={setScope}>
                <SelectTrigger className="!bg-silver-two !border-0 !border-b-2 !border-transparent rounded-t-xl py-4 px-6">
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  <SelectItem value="intracity">Intracity Only (Local Delivery)</SelectItem>
                  <SelectItem value="interstate">Interstate (State-to-State)</SelectItem>
                  <SelectItem value="both">Both (Intracity & Interstate)</SelectItem>
                </SelectPopup>
              </Select>
            </div>
          </div>
        </section>

        <div className="h-px bg-border w-full" />

        {/* Serviceable Areas */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-primary">Serviceable Areas</h4>
            <p className="text-sm text-muted-foreground">Select specific regions where your team can currently fulfill delivery requests.</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 ml-1">Active Zones</label>
            <div className="flex flex-wrap gap-3">
              {zones.map((zone) => (
                <Button
                  key={zone}
                  variant="ghost"
                  onClick={() => removeZone(zone)}
                  className="rounded-full bg-secondary/10 text-secondary font-bold flex items-center gap-2 border-2 border-secondary/20 hover:bg-secondary/20 hover:text-secondary px-6 py-3 h-auto"
                >
                  {zone}
                  <MaterialIcon name="close" size={16} color="var(--secondary)" />
                </Button>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  value={newZone}
                  onChange={(e) => setNewZone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addZone()}
                  placeholder="Add Region"
                  className="rounded-full bg-silver-two border-0 focus-visible:ring-2 focus-visible:ring-secondary"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={addZone}
                  className="rounded-full bg-silver-two text-muted-foreground hover:bg-border"
                >
                  <MaterialIcon name="add" size={18} color="var(--muted-foreground)" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="h-px bg-border w-full" />

        {/* Vehicle Fleet */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-primary">Vehicle Fleet</h4>
            <p className="text-sm text-muted-foreground">Manage the types of transport available in your network for specialized handling.</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 ml-1">Registered Vehicles</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map((v) => {
                const isSelected = selectedVehicles.includes(v.id)
                return (
                  <div
                    key={v.id}
                    onClick={() => toggleVehicle(v.id)}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 text-center cursor-pointer transition-all group ${
                      isSelected
                        ? "bg-secondary/10 border-secondary"
                        : "bg-popover border-border/60 hover:border-secondary"
                    }`}
                  >
                    <MaterialIcon
                      name={v.icon}
                      size={36}
                      color={isSelected ? "var(--secondary)" : "var(--muted-foreground)"}
                    />
                    <div>
                      <p className="font-bold text-primary">{v.label}</p>
                      <p className={`text-xs ${isSelected ? "text-secondary" : "text-muted-foreground"}`}>{v.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <div className="h-px bg-border w-full" />

        {/* Operating Hours */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-primary">Operating Hours</h4>
            <p className="text-sm text-muted-foreground">Set your business availability to manage customer expectations and driver shifts.</p>
          </div>
          <div className="md:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-silver-two p-6 rounded-2xl">
              <div className="flex items-center gap-3 min-w-[120px]">
                <MaterialIcon name="calendar_view_week" size={20} color="var(--secondary)" />
                <span className="font-bold">Weekdays</span>
              </div>
              <div className="flex-1 flex items-center gap-4">
                <Input
                  type="time"
                  value={weekdayStart}
                  onChange={(e) => setWeekdayStart(e.target.value)}
                  className="flex-1 bg-popover border-0 text-center font-bold focus-visible:ring-2 focus-visible:ring-secondary"
                />
                <span className="text-muted-foreground font-bold">to</span>
                <Input
                  type="time"
                  value={weekdayEnd}
                  onChange={(e) => setWeekdayEnd(e.target.value)}
                  className="flex-1 bg-popover border-0 text-center font-bold focus-visible:ring-2 focus-visible:ring-secondary"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-silver-two p-6 rounded-2xl">
              <div className="flex items-center gap-3 min-w-[120px]">
                <MaterialIcon name="weekend" size={20} color="var(--secondary)" />
                <span className="font-bold">Weekends</span>
              </div>
              <div className="flex-1 flex items-center gap-4">
                <Input
                  type="time"
                  value={weekendStart}
                  onChange={(e) => setWeekendStart(e.target.value)}
                  className="flex-1 bg-popover border-0 text-center font-bold focus-visible:ring-2 focus-visible:ring-secondary"
                />
                <span className="text-muted-foreground font-bold">to</span>
                <Input
                  type="time"
                  value={weekendEnd}
                  onChange={(e) => setWeekendEnd(e.target.value)}
                  className="flex-1 bg-popover border-0 text-center font-bold focus-visible:ring-2 focus-visible:ring-secondary"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Finalize CTA */}
        <div className="pt-8 pb-16">
          <div className="bg-primary p-8 rounded-3xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h5 className="text-white text-xl font-bold mb-2">Ready to optimize?</h5>
                <p className="text-white/80 text-sm opacity-80 max-w-sm">Changes will be pushed to the real-time driver dispatcher system immediately upon saving.</p>
              </div>
              <Button variant="default" className="bg-secondary hover:bg-secondary/90 px-10 py-6 rounded-xl font-black uppercase tracking-wider text-sm shadow-xl shadow-black/20 active:scale-95">
                Finalize Ops Plan
              </Button>
            </div>
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-secondary opacity-10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute -left-16 -top-16 w-48 h-48 bg-secondary opacity-5 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
