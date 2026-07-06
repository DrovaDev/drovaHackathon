"use client"

import { useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectPopup, SelectItem } from "@/components/ui/select"
import MaterialIcon from "@/components/ui/material-icon"
import Link from "next/link"
import { business } from "@/services/router"
import axios from "axios"
import { toast } from "sonner"

const STOREFRONT_BASE_URL = "https://drova-hackathon-mcun.vercel.app"

export default function StorefrontOverviewPage() {
  const queryClient = useQueryClient()
  const { data: profileResponse } = business.getProfile.useQuery()
  const profile = profileResponse?.data

  const { data: lookupsResponse, isLoading: isLookupsLoading } =
    business.getBusinessLookups.useQuery()
  const states = lookupsResponse?.data?.states ?? []

  const [copied, setCopied] = useState(false)
  const [contactPhone, setContactPhone] = useState("")
  const [businessAddress, setBusinessAddress] = useState("")
  const [businessState, setBusinessState] = useState("")

  useEffect(() => {
    if (profile?.contactNumber) {
      setContactPhone(profile.contactNumber)
    }
    if (profile?.businessAddress) {
      setBusinessAddress(profile.businessAddress)
    }
    if (profile?.businessState) {
      setBusinessState(profile.businessState)
    }
  }, [profile])

  const { mutate: saveProfile, isPending: isSaving } =
    business.profileEdit.useMutation({
      onSuccess: (response) => {
        toast.success(response.message || "Business details updated")
        queryClient.invalidateQueries({ queryKey: business.getProfile.getKey() })
      },
      onError: (error) => {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined
        toast.error(message || "Unable to update business details. Try again.")
      },
    })

  const handleSave = () => {
    if (!profile) return
    saveProfile({
      businessName: profile.businessName,
      businessDescription: profile.businessDescription,
      businessAddress: businessAddress,
      businessState: businessState,
      location: profile.location,
      deliveryScope: profile.deliveryScope,
      fleetSize: profile.fleetSize,
      businessRegistrationNumber: profile.businessRegistrationNumber,
      taxIdentificationNumber: profile.taxIdentificationNumber,
      bvn: profile.bvn,
      contactNumber: contactPhone,
      businessLogo: profile.businessLogo,
      coverImage: profile.coverImage,
      operatingHours: profile.operatingHours,
    })
  }

  const storefrontUrl = profile?.slug
    ? `${STOREFRONT_BASE_URL}/${profile.slug}`
    : STOREFRONT_BASE_URL

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
                value={profile?.businessName ?? ""}
                disabled
                className="bg-silver-two border-0 focus-visible:ring-secondary disabled:opacity-70"
              />
              <p className="text-[10px] text-muted-foreground italic">Contact support to change your business name.</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Business Address</label>
              <Textarea
                value={businessAddress}
                onChange={e => setBusinessAddress(e.target.value)}
                rows={1}
                className="bg-silver-two border-0 focus-visible:ring-secondary resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Business State</label>
              <Select value={businessState} onValueChange={setBusinessState} disabled={isLookupsLoading}>
                <SelectTrigger className="!bg-silver-two !border-0">
                  <SelectValue placeholder={isLookupsLoading ? "Loading states..." : "Select a state"} />
                </SelectTrigger>
                <SelectPopup>
                  {states.map(({ key, value }) => (
                    <SelectItem key={key} value={value}>{value}</SelectItem>
                  ))}
                </SelectPopup>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Contact Phone</label>
              <Input
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                className="bg-silver-two border-0 focus-visible:ring-secondary"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving || !profile}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
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
                <div className="text-xs text-muted-foreground mt-0.5">Logo, cover image, description</div>
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
