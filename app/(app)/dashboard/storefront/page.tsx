"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MaterialIcon from "@/components/ui/material-icon"
import Link from "next/link"

const storefrontUrl = "https://drova.app/s/speedex-couriers"

export default function StorefrontOverviewPage() {
  const [copied, setCopied] = useState(false)
  const [businessName, setBusinessName] = useState("Speedex Couriers")
  const [tagline, setTagline] = useState("Fast. Reliable. Trusted.")
  const [contactPhone, setContactPhone] = useState("08012345678")
  const [whatsappNumber, setWhatsappNumber] = useState("08012345678")

  const handleCopy = () => {
    navigator.clipboard.writeText(storefrontUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="px-4 sm:px-8 lg:px-12 py-10">
      <div className="max-w-4xl space-y-8">

        {/* Storefront link card */}
        <div className="bg-primary rounded-2xl p-6 text-primary-foreground relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
              <div>
                <h2 className="text-lg font-extrabold text-white mb-1">Your Public Storefront</h2>
                <p className="text-white/70 text-sm max-w-sm">
                  Share this link with customers so they can discover your business and submit delivery quotations — no account required.
                </p>
              </div>
              <a href={storefrontUrl} target="_blank" rel="noreferrer">
                <Button variant="secondary" className="gap-2">
                  <MaterialIcon name="open_in_new" size={14} color="var(--secondary-foreground)" />
                  Preview
                </Button>
              </a>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5">
              <MaterialIcon name="link" size={16} color="rgba(255,255,255,0.6)" />
              <span className="text-white/80 text-sm font-mono flex-1 truncate">{storefrontUrl}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
              >
                <MaterialIcon name={copied ? "check" : "content_copy"} size={13} color="white" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        {/* Storefront status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "star", label: "Customer Rating", value: "4.8 / 5", sub: "From 34 reviews", bg: "bg-amber-50", color: "#D97706" },
            { icon: "receipt_long", label: "Quotations Received", value: "142", sub: "Since storefront went live", bg: "bg-primary/5", color: "var(--primary)" },
            { icon: "visibility", label: "Storefront Views", value: "891", sub: "Last 30 days", bg: "bg-secondary/10", color: "var(--secondary)" },
          ].map(s => (
            <div key={s.label} className="bg-popover rounded-2xl border border-border p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.bg}`}>
                <MaterialIcon name={s.icon} size={20} color={s.color} />
              </div>
              <div className="text-2xl font-extrabold text-primary">{s.value}</div>
              <div className="text-sm font-semibold text-foreground mt-0.5">{s.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Business details */}
        <div className="bg-popover rounded-2xl border border-border p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-primary text-base">Business Details</h3>
            <span className="text-xs text-muted-foreground">Displayed on your storefront</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Business Name</label>
              <Input
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                className="bg-silver-two border-0 focus-visible:ring-secondary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Tagline</label>
              <Input
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="bg-silver-two border-0 focus-visible:ring-secondary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Contact Phone</label>
              <Input
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                className="bg-silver-two border-0 focus-visible:ring-secondary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">WhatsApp Number</label>
              <Input
                value={whatsappNumber}
                onChange={e => setWhatsappNumber(e.target.value)}
                className="bg-silver-two border-0 focus-visible:ring-secondary"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </div>

        {/* Quick links to other settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/dashboard/storefront/branding">
            <div className="bg-popover rounded-2xl border border-border p-5 cursor-pointer hover:border-secondary/40 hover:shadow-sm transition-all flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <MaterialIcon name="palette" size={22} color="var(--secondary)" />
              </div>
              <div>
                <div className="font-bold text-foreground">Identity & Branding</div>
                <div className="text-xs text-muted-foreground mt-0.5">Logo, cover image, description, social links</div>
              </div>
              <MaterialIcon name="arrow_forward_ios" size={14} color="var(--muted-foreground)" />
            </div>
          </Link>
          <Link href="/dashboard/storefront/operations">
            <div className="bg-popover rounded-2xl border border-border p-5 cursor-pointer hover:border-secondary/40 hover:shadow-sm transition-all flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center">
                <MaterialIcon name="settings" size={22} color="var(--primary)" />
              </div>
              <div>
                <div className="font-bold text-foreground">Operations</div>
                <div className="text-xs text-muted-foreground mt-0.5">Hours, delivery scope, vehicle fleet, service types</div>
              </div>
              <MaterialIcon name="arrow_forward_ios" size={14} color="var(--muted-foreground)" />
            </div>
          </Link>
        </div>

      </div>
    </div>
  )
}
