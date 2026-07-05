"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MaterialIcon from "@/components/ui/material-icon"
import { mockQuotations, quotationStatusConfig } from "@/lib/mock-quotations"

export default function QuotationDetailPage() {
  const params = useParams<{ orderId: string }>()
  const router = useRouter()
  const quotation = mockQuotations.find(q => q.id === params.orderId)

  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false)
  const [price, setPrice] = useState("")
  const [expiry, setExpiry] = useState("24")

  if (!quotation) {
    return (
      <div className="px-6 lg:px-10 py-8">
        <div className="bg-popover rounded-2xl border border-border p-10 text-center space-y-3">
          <MaterialIcon name="search_off" size={32} color="var(--muted-foreground)" />
          <h2 className="text-lg font-bold text-primary">Quotation not found</h2>
          <p className="text-sm text-muted-foreground">We couldn&apos;t find a quotation with ID &quot;{params.orderId}&quot;.</p>
          <Link href="/dashboard/orders">
            <Button variant="secondary" className="mt-2">Back to Orders</Button>
          </Link>
        </div>
      </div>
    )
  }

  const cfg = quotationStatusConfig[quotation.status]

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <button
            onClick={() => router.push("/dashboard/orders")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <MaterialIcon name="arrow_back" size={16} color="var(--muted-foreground)" />
            Back to Orders
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-primary tracking-tight">{quotation.id}</h1>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${cfg.bg} ${cfg.text}`}>
              {cfg.label}
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-0.5">Submitted {quotation.submittedAt}</p>
        </div>
        <div className="flex items-center gap-2">
          {quotation.status === "PENDING" && (
            <Button onClick={() => { setInvoiceModalOpen(true); setPrice("") }}>
              Generate Invoice
            </Button>
          )}
          {quotation.status === "INVOICED" && quotation.nombaPaymentLink && (
            <a href={quotation.nombaPaymentLink} target="_blank" rel="noreferrer">
              <Button variant="secondary">
                <MaterialIcon name="link" size={14} color="white" />
                Payment Link
              </Button>
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sender details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-popover rounded-2xl border border-border p-6 space-y-5">
            <h3 className="font-bold text-primary text-base">Sender Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Name</p>
                <p className="font-semibold text-foreground">{quotation.senderName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Phone</p>
                <p className="font-semibold text-foreground">{quotation.senderPhone}</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Email</p>
                <p className="font-semibold text-foreground">{quotation.senderEmail}</p>
              </div>
            </div>
          </div>

          <div className="bg-popover rounded-2xl border border-border p-6 space-y-5">
            <h3 className="font-bold text-primary text-base">Delivery Details</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 mt-0.5">
                  <MaterialIcon name="trip_origin" size={16} color="var(--primary)" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Pickup Address</p>
                  <p className="text-sm text-foreground mt-0.5">{quotation.pickupAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MaterialIcon name="location_on" size={16} color="var(--secondary)" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Delivery Address</p>
                  <p className="text-sm text-foreground mt-0.5">{quotation.deliveryAddress}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/60">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Package Type</p>
                <span className="inline-block text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-medium">{quotation.packageType}</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Preferred Date</p>
                <p className="font-semibold text-foreground text-sm">{quotation.preferredDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="space-y-6">
          <div className="bg-popover rounded-2xl border border-border p-6 space-y-4">
            <h3 className="font-bold text-primary text-base">Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${cfg.bg} ${cfg.text}`}>
                  {cfg.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Submitted</span>
                <span className="font-medium text-foreground">{quotation.submittedAt}</span>
              </div>
              {quotation.amount && (
                <div className="flex items-center justify-between pt-3 border-t border-border/60">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-bold text-primary">{quotation.amount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Generate Invoice Modal */}
      {invoiceModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-popover rounded-2xl border border-border p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-primary">Generate Invoice</h3>
              <button onClick={() => setInvoiceModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <MaterialIcon name="close" size={20} color="var(--muted-foreground)" />
              </button>
            </div>
            <div className="space-y-1 mb-5 bg-silver-two rounded-xl p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-bold">Quotation</p>
              <p className="font-bold text-foreground">{quotation.id} — {quotation.senderName}</p>
              <p className="text-xs text-muted-foreground">{quotation.pickupAddress} → {quotation.deliveryAddress}</p>
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
                <Button variant="ghost" className="flex-1" onClick={() => setInvoiceModalOpen(false)}>Cancel</Button>
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
