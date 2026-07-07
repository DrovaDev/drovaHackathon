"use client"

import { useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import MaterialIcon from "@/components/ui/material-icon"
import { transaction } from "@/services/router"
import { getCachedRiderPayoutTransaction } from "@/lib/rider-payout-cache"
import { getRiderPayoutStatusConfig } from "@/lib/rider-payout-status"

const FALLBACK_QUERY_LIMIT = 100

function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleString("en-NG", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground text-right">{value}</span>
    </div>
  )
}

export default function RiderPayoutDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const cached = useMemo(
    () => getCachedRiderPayoutTransaction(params.id),
    [params.id],
  )

  const { data, isLoading, isError } = transaction.getTransactions.useQuery({
    variables: {
      page: 1,
      limit: FALLBACK_QUERY_LIMIT,
      type: "business_to_rider_payout",
    },
    enabled: !cached,
  })

  const fallback = data?.data?.find((t) => t.id === params.id)
  const payout = cached ?? fallback

  if (!cached && isLoading) {
    return (
      <div className="px-6 lg:px-10 py-8 text-muted-foreground text-sm">
        Loading rider payout...
      </div>
    )
  }

  if (!payout) {
    return (
      <div className="px-6 lg:px-10 py-8">
        <div className="bg-popover rounded-2xl border border-border p-10 text-center space-y-3">
          <MaterialIcon name="search_off" size={32} color="var(--muted-foreground)" />
          <h2 className="text-lg font-bold text-primary">Rider payout not found</h2>
          <p className="text-sm text-muted-foreground">
            {isError
              ? "Failed to load rider payouts."
              : `We couldn't find a rider payout with ID "${params.id}".`}
          </p>
          <Link href="/dashboard/payout">
            <Button variant="secondary" className="mt-2">Back to Payout</Button>
          </Link>
        </div>
      </div>
    )
  }

  const { journal } = payout
  const rider = journal.rider
  const riderName = `${rider.firstName} ${rider.lastName}`.trim()
  const cfg = getRiderPayoutStatusConfig(journal.status)

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <button
          onClick={() => router.push("/dashboard/payout")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <MaterialIcon name="arrow_back" size={16} color="var(--muted-foreground)" />
          Back to Payout
        </button>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">
            {journal.reference}
          </h1>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${cfg.bg} ${cfg.text}`}
          >
            <MaterialIcon name={cfg.icon} size={12} color="currentColor" />
            {cfg.label}
          </span>
        </div>
        <p className="text-muted-foreground text-sm mt-0.5">
          Created {formatDateTime(payout.createdAt)}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Amount breakdown */}
          <div className="bg-popover rounded-xl p-8 border border-border space-y-4">
            <h3 className="font-bold text-lg text-primary">Payout Breakdown</h3>
            <div className="space-y-2.5 text-sm">
              <SummaryRow
                label="Rider Amount"
                value={
                  journal.metadata?.riderAmount != null
                    ? formatNaira(journal.metadata.riderAmount)
                    : "—"
                }
              />
              <SummaryRow
                label="Platform Fee"
                value={
                  journal.metadata?.platformFee != null
                    ? formatNaira(journal.metadata.platformFee)
                    : "—"
                }
              />
              <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Total Amount</span>
                <span className="font-extrabold text-primary text-lg">
                  {formatNaira(payout.amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction info */}
          <div className="bg-popover rounded-xl p-8 border border-border space-y-4">
            <h3 className="font-bold text-lg text-primary">Transaction</h3>
            <div className="space-y-2.5 text-sm">
              <SummaryRow label="Reference" value={journal.reference} />
              <SummaryRow label="Direction" value={payout.direction} />
              <SummaryRow label="Currency" value={payout.currency} />
              {journal.orderId && (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Order</span>
                  <Link
                    href={`/dashboard/orders/${journal.orderId}`}
                    className="font-semibold text-secondary hover:underline text-right"
                  >
                    View Order
                  </Link>
                </div>
              )}
              <SummaryRow label="Posted At" value={formatDateTime(journal.postedAt)} />
              <SummaryRow label="Created At" value={formatDateTime(journal.createdAt)} />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Rider */}
          <div className="bg-primary text-white rounded-xl p-8 border border-primary/20 space-y-4">
            <h3 className="font-bold text-lg">Rider</h3>
            <div className="flex items-center gap-3">
              {rider.profilePhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={rider.profilePhoto}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-white/20"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <MaterialIcon name="person" size={24} color="white" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold truncate">{riderName}</p>
                  <a
                    href={`tel:${rider.phoneNumber}`}
                    className="shrink-0 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <MaterialIcon name="call" size={14} color="white" />
                  </a>
                </div>
                <p className="text-white/60 text-xs">{rider.phoneNumber}</p>
                <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-wide">
                  {rider.availabilityStatus}
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-white/10 space-y-2.5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Vehicle</span>
                <span className="font-bold capitalize">
                  {rider.vehicleType} · {rider.vehicleModel}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Color</span>
                <span className="font-bold capitalize">{rider.vehicleColor}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Plate Number</span>
                <span className="font-bold px-2 py-0.5 bg-white/10 rounded uppercase tracking-tighter">
                  {rider.vehiclePlateNumber}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
