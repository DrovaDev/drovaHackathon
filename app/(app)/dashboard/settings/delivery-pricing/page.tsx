"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import MaterialIcon from "@/components/ui/material-icon"
import Link from "next/link"

interface Bracket {
  id: number
  min: string
  max: string
  fee: string
}

interface StateRow {
  abbr: string
  name: string
  fee: string
  enabled: boolean
}

export default function DeliveryPricingPage() {
  const [brackets, setBrackets] = useState<Bracket[]>([
    { id: 1, min: "0", max: "3", fee: "800" },
    { id: 2, min: "3.1", max: "8", fee: "1,500" },
  ])
  const [states, setStates] = useState<StateRow[]>([
    { abbr: "LA", name: "Lagos", fee: "2,500", enabled: true },
    { abbr: "AB", name: "Abuja (FCT)", fee: "3,500", enabled: true },
    { abbr: "RV", name: "Rivers", fee: "4,000", enabled: false },
    { abbr: "KN", name: "Kano", fee: "4,500", enabled: true },
    { abbr: "OY", name: "Oyo", fee: "2,200", enabled: true },
  ])
  const [searchQuery, setSearchQuery] = useState("")

  const addBracket = () => {
    setBrackets((prev) => [...prev, { id: Date.now(), min: "", max: "", fee: "" }])
  }

  const removeBracket = (id: number) => {
    setBrackets((prev) => prev.filter((b) => b.id !== id))
  }

  const toggleState = (abbr: string) => {
    setStates((prev) =>
      prev.map((s) => (s.abbr === abbr ? { ...s, enabled: !s.enabled } : s))
    )
  }

  const filteredStates = states.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="px-8 lg:px-12 py-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
          <Link href="/dashboard/settings" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
            <MaterialIcon name="arrow_back" size={16} color="var(--muted-foreground)" className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold uppercase tracking-wider">Back to Overview</span>
          </Link>
          <h1 className="text-4xl font-extrabold text-primary tracking-tight">Set Delivery Pricing</h1>
          <p className="text-muted-foreground max-w-xl leading-relaxed">
            Configure your logistics revenue model by defining distance-based tiers and regional delivery surcharges across the federation.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">Cancel</Button>
          <Button variant="default">Save Pricing</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Intracity Pricing — 5 cols */}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-popover p-8 rounded-xl border border-border space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-primary">Intracity Pricing</h2>
                <p className="text-xs text-muted-foreground font-medium mt-1">Distance-based brackets for local deliveries</p>
              </div>
              <MaterialIcon name="distance" size={24} color="var(--secondary)" />
            </div>
            <div className="space-y-4">
              {brackets.map((bracket) => (
                <div key={bracket.id} className="bg-silver-two p-6 rounded-xl border-b-2 border-secondary space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                    <span>Bracket {String(bracket.id).padStart(2, "0")}</span>
                    <Button variant="ghost" size="icon-xs" onClick={() => removeBracket(bracket.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <MaterialIcon name="delete" size={16} color="var(--destructive)" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground px-1">Min (km)</label>
                      <Input
                        value={bracket.min}
                        onChange={(e) => {
                          const updated = [...brackets]
                          const idx = updated.findIndex((b) => b.id === bracket.id)
                          updated[idx].min = e.target.value
                          setBrackets(updated)
                        }}
                        className="bg-silver-two focus-visible:ring-secondary/20 focus-visible:border-secondary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground px-1">Max (km)</label>
                      <Input
                        value={bracket.max}
                        onChange={(e) => {
                          const updated = [...brackets]
                          const idx = updated.findIndex((b) => b.id === bracket.id)
                          updated[idx].max = e.target.value
                          setBrackets(updated)
                        }}
                        className="bg-silver-two focus-visible:ring-secondary/20 focus-visible:border-secondary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground px-1">Fee (₦)</label>
                      <Input
                        value={bracket.fee}
                        onChange={(e) => {
                          const updated = [...brackets]
                          const idx = updated.findIndex((b) => b.id === bracket.id)
                          updated[idx].fee = e.target.value
                          setBrackets(updated)
                        }}
                        className="bg-silver-two font-semibold text-secondary focus-visible:ring-secondary/20 focus-visible:border-secondary"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addBracket}
                className="w-full py-7 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-secondary hover:text-secondary flex items-center justify-center gap-2"
              >
                <MaterialIcon name="add_circle" size={20} color="var(--muted-foreground)" className="" />
                <span className="text-sm font-bold">Add New Bracket</span>
              </Button>
            </div>
          </div>

          <div className="bg-primary p-6 rounded-xl text-primary-foreground flex gap-4 items-start">
            <MaterialIcon name="lightbulb" size={24} color="var(--chart-2)" />
            <p className="text-sm leading-relaxed opacity-90">
              Most successful partners use a <strong>₦800 base fee</strong> for the first 3km to ensure profitability on short-haul trips.
            </p>
          </div>
        </section>

        {/* Interstate Pricing — 7 cols */}
        <section className="lg:col-span-7 space-y-6">
          <div className="bg-popover p-8 rounded-xl border border-border space-y-8 flex flex-col h-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-primary">Interstate Pricing</h2>
                <p className="text-xs text-muted-foreground font-medium mt-1">Manage shipping rates across Nigeria</p>
              </div>
              <div className="relative w-full md:w-64">
                <MaterialIcon name="search" size={18} color="var(--muted-foreground)" className="absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search states..."
                  className="pl-10 bg-silver-two focus-visible:ring-secondary/20 focus-visible:border-secondary"
                />
              </div>
            </div>

            <div className="space-y-2 flex-1 overflow-y-auto max-h-[600px] pr-2">
              <div className="grid grid-cols-12 px-6 py-2 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest border-b border-border/40">
                <div className="col-span-5">State</div>
                <div className="col-span-4">Delivery Fee (₦)</div>
                <div className="col-span-3 text-right">Status</div>
              </div>
              {filteredStates.map((state) => (
                <div
                  key={state.abbr}
                  className={`grid grid-cols-12 items-center px-6 py-4 bg-silver-two rounded-xl hover:shadow-md transition-shadow group ${
                    !state.enabled ? "opacity-60" : ""
                  }`}
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xs">
                      {state.abbr}
                    </div>
                    <span className="font-bold text-primary">{state.name}</span>
                  </div>
                  <div className="col-span-4">
                    <Input
                      value={state.fee}
                      onChange={(e) => {
                        const updated = [...states]
                        const idx = updated.findIndex((s) => s.abbr === state.abbr)
                        updated[idx].fee = e.target.value
                        setStates(updated)
                      }}
                      disabled={!state.enabled}
                      className={`w-32 bg-silver-two focus-visible:ring-secondary/20 focus-visible:border-secondary ${!state.enabled ? "cursor-not-allowed" : ""}`}
                    />
                  </div>
                  <div className="col-span-3 flex justify-end">
                    <Switch
                      checked={state.enabled}
                      onCheckedChange={() => toggleState(state.abbr)}
                    />
                  </div>
                </div>
              ))}
              <div className="py-4 text-center">
                <Button variant="link" size="sm" className="text-xs font-bold text-secondary uppercase tracking-widest">
                  Show 31 More States
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:hidden z-50">
        <div className="bg-popover/80 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/20 flex gap-4">
          <Button variant="outline" className="flex-1">Cancel</Button>
          <Button variant="default" className="flex-[2]">Save Changes</Button>
        </div>
      </div>
    </div>
  )
}
