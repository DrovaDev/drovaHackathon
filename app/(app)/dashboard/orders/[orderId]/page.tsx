"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import MaterialIcon from "@/components/ui/material-icon"
import { CustomerInfoCard, MapCard, DeliveryTimeline } from "@/components/orders"
import { order } from "@/api/router"
import { orderStatusConfig } from "@/lib/order-status"
import type { OrderStatus, OrderTracking } from "@/api/types/order.types"

type TrackingKey =
  | "confirmedAt"
  | "assignedAt"
  | "enRoutePickupAt"
  | "pickedUpAt"
  | "inTransitAt"
  | "arrivedAtDeliveryAt"
  | "deliveredAt"
  | "completedAt"

const TRACKING_STEPS: { key: TrackingKey; label: string }[] = [
  { key: "confirmedAt", label: "Order Confirmed" },
  { key: "assignedAt", label: "Rider Assigned" },
  { key: "enRoutePickupAt", label: "En Route to Pickup" },
  { key: "pickedUpAt", label: "Picked Up" },
  { key: "inTransitAt", label: "In Transit" },
  { key: "arrivedAtDeliveryAt", label: "Arrived at Delivery" },
  { key: "deliveredAt", label: "Delivered" },
  { key: "completedAt", label: "Completed" },
]

function formatNaira(amount: number | null): string {
  if (amount === null) return "—"
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDateTime(value: string | null): string {
  if (!value) return "—"
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

function capitalize(value: string): string {
  return value
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

function buildTimelineSteps(tracking: OrderTracking) {
  if (tracking.cancelledAt) {
    return [
      {
        label: "Order Cancelled",
        time: formatDateTime(tracking.cancelledAt),
        description: tracking.cancellationReason ?? "",
        completed: true,
      },
    ]
  }

  const lastCompletedIndex = TRACKING_STEPS.reduce(
    (acc, step, idx) => (tracking[step.key] ? idx : acc),
    -1,
  )

  return TRACKING_STEPS.map((step, idx) => ({
    label: step.label,
    time: tracking[step.key] ? formatDateTime(tracking[step.key]) : "Pending",
    description: "",
    completed: idx < lastCompletedIndex,
    active: idx === lastCompletedIndex,
    upcoming: idx > lastCompletedIndex,
  }))
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = orderStatusConfig[status]
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${cfg.bg} ${cfg.text}`}>
      <MaterialIcon name={cfg.icon} size={12} color="currentColor" />
      {cfg.label}
    </span>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground text-right">{value}</span>
    </div>
  )
}

function NoteRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 mt-0.5">
        <MaterialIcon name={icon} size={16} color="var(--primary)" />
      </div>
      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
        <p className="text-sm text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export default function OrderDetailPage() {
  const params = useParams<{ orderId: string }>()
  const router = useRouter()

  const { data, isLoading, isError } = order.getOrder.useQuery({
    variables: { id: params.orderId },
  })
  const orderData = data?.data

  if (isLoading) {
    return (
      <div className="px-6 lg:px-10 py-8 text-muted-foreground text-sm">Loading order...</div>
    )
  }

  if (isError || !orderData) {
    return (
      <div className="px-6 lg:px-10 py-8">
        <div className="bg-popover rounded-2xl border border-border p-10 text-center space-y-3">
          <MaterialIcon name="search_off" size={32} color="var(--muted-foreground)" />
          <h2 className="text-lg font-bold text-primary">Order not found</h2>
          <p className="text-sm text-muted-foreground">
            We couldn&apos;t find an order with ID &quot;{params.orderId}&quot;.
          </p>
          <Link href="/dashboard/orders">
            <Button variant="secondary" className="mt-2">Back to Orders</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isQuotationStage =
    orderData.status === "quotation" || orderData.status === "pending" || !orderData.paidAt

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 space-y-6 max-w-6xl">
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
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-extrabold text-primary tracking-tight">{orderData.referenceCode}</h1>
            <StatusBadge status={orderData.status} />
          </div>
          <p className="text-muted-foreground text-sm mt-0.5">Created {formatDateTime(orderData.createdAt)}</p>
        </div>
        {orderData.paymentLink && (
          <a href={orderData.paymentLink} target="_blank" rel="noreferrer">
            <Button variant="secondary">
              <MaterialIcon name="link" size={14} color="white" />
              Payment Link
            </Button>
          </a>
        )}
      </div>

      {orderData.cancelledAt && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <MaterialIcon name="cancel" size={20} color="#DC2626" />
          <div>
            <p className="font-bold text-red-700 text-sm">Order Cancelled</p>
            <p className="text-xs text-red-600 mt-0.5">
              {orderData.cancellationReason ?? "No reason provided."} · {formatDateTime(orderData.cancelledAt)}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <MapCard
            pickupAddress={orderData.locations.pickupAddress}
            deliveryAddress={orderData.locations.deliveryAddress}
            pickupCoords={orderData.locations.pickupCoordinates.coordinates}
            deliveryCoords={orderData.locations.deliveryCoordinates.coordinates}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <CustomerInfoCard
              title="Sender"
              name={orderData.parties.guestFullName}
              phone={orderData.parties.guestContactNumber}
              email={orderData.parties.guestEmail}
            />
            <CustomerInfoCard
              title="Recipient"
              name={orderData.parties.recipientFullName}
              phone={orderData.parties.recipientContactNumber}
              email={orderData.parties.recipientEmail}
            />
          </div>

          {/* Package items */}
          <div className="bg-popover rounded-xl p-8 border border-border space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-primary">Package Items</h3>
              <MaterialIcon name="inventory_2" size={20} color="var(--muted-foreground)" />
            </div>
            <div className="divide-y divide-border">
              {orderData.items.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-foreground">{item.packageName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.packageDescription}</p>
                    </div>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-medium capitalize shrink-0">
                      {item.packageType}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider mb-1">Quantity</p>
                      <p className="font-bold text-foreground text-sm">{item.quantity}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider mb-1">Weight</p>
                      <p className="font-bold text-foreground text-sm">{item.estimatedWeight} kg</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider mb-1">Est. Value</p>
                      <p className="font-bold text-foreground text-sm">{formatNaira(item.estimatedValue)}</p>
                    </div>
                  </div>
                  {item.specialInstructions && (
                    <div className="flex items-start gap-2 bg-silver-two p-3 rounded-lg mt-3">
                      <MaterialIcon name="warning" size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs font-semibold text-muted-foreground">{item.specialInstructions}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <DeliveryTimeline steps={buildTimelineSteps(orderData.tracking)} />

          {(orderData.customerNote || orderData.pickupInstructions || orderData.deliveryInstructions) && (
            <div className="bg-popover rounded-xl p-8 border border-border space-y-4">
              <h3 className="font-bold text-lg text-primary">Notes &amp; Instructions</h3>
              {orderData.customerNote && (
                <NoteRow icon="sticky_note_2" label="Customer Note" value={orderData.customerNote} />
              )}
              {orderData.pickupInstructions && (
                <NoteRow icon="assignment" label="Pickup Instructions" value={orderData.pickupInstructions} />
              )}
              {orderData.deliveryInstructions && (
                <NoteRow icon="local_shipping" label="Delivery Instructions" value={orderData.deliveryInstructions} />
              )}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Order summary */}
          <div className="bg-popover rounded-xl p-8 border border-border space-y-4">
            <h3 className="font-bold text-lg text-primary">Order Summary</h3>
            <div className="space-y-2.5 text-sm">
              <SummaryRow
                label="Pickup Method"
                value={orderData.pickupMethod === "business_pickup" ? "Business Pickup" : "Walk-in"}
              />
              <SummaryRow
                label="Delivery Priority"
                value={orderData.deliveryPriority ? capitalize(orderData.deliveryPriority) : "—"}
              />
              {orderData.prefferedDeliveryTime && (
                <SummaryRow label="Preferred Delivery" value={formatDateTime(orderData.prefferedDeliveryTime)} />
              )}
              <div className="pt-3 border-t border-border/60 space-y-2.5">
                <SummaryRow label="Delivery Fee" value={formatNaira(orderData.deliveryFee)} />
                <SummaryRow label="Pickup Fee" value={formatNaira(orderData.pickupFee)} />
                <SummaryRow label="Packaging Fee" value={formatNaira(orderData.packagingFee)} />
                <SummaryRow label="Service Fee" value={formatNaira(orderData.serviceFee)} />
              </div>
              <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Total Amount</span>
                <span className="font-extrabold text-primary text-lg">{formatNaira(orderData.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          {!isQuotationStage && (
            <div className="bg-popover rounded-xl p-8 border border-border space-y-3">
              <h3 className="font-bold text-lg text-primary">Payment</h3>
              <div className="space-y-2.5 text-sm">
                <SummaryRow label="Status" value={capitalize(orderData.paymentStatus)} />
                {orderData.paymentReference && <SummaryRow label="Reference" value={orderData.paymentReference} />}
                {orderData.invoiceSentAt && <SummaryRow label="Invoice Sent" value={formatDateTime(orderData.invoiceSentAt)} />}
                {orderData.paidAt && <SummaryRow label="Paid At" value={formatDateTime(orderData.paidAt)} />}
                {orderData.offerExpiresAt && <SummaryRow label="Offer Expires" value={formatDateTime(orderData.offerExpiresAt)} />}
              </div>
            </div>
          )}

          {/* Rider */}
          {!isQuotationStage && (
            <div className="bg-primary text-white rounded-xl p-8 border border-primary/20 space-y-4">
              <h3 className="font-bold text-lg">Assigned Rider</h3>
              {orderData.rider ? (
                <>
                  <div className="flex items-center gap-3">
                    {orderData.rider.profilePhoto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={orderData.rider.profilePhoto}
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
                        <p className="font-bold truncate">
                          {orderData.rider.firstName} {orderData.rider.lastName}
                        </p>
                        <a
                          href={`tel:${orderData.rider.phoneNumber}`}
                          className="shrink-0 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                          <MaterialIcon name="call" size={14} color="white" />
                        </a>
                      </div>
                      <p className="text-white/60 text-xs">{orderData.rider.phoneNumber}</p>
                      <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-wide">
                        {orderData.rider.availabilityStatus}
                      </span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/10 space-y-2.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Vehicle</span>
                      <span className="font-bold capitalize">
                        {orderData.rider.vehicleType} · {orderData.rider.vehicleModel}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Color</span>
                      <span className="font-bold capitalize">{orderData.rider.vehicleColor}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Plate Number</span>
                      <span className="font-bold px-2 py-0.5 bg-white/10 rounded uppercase tracking-tighter">
                        {orderData.rider.vehiclePlateNumber}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <MaterialIcon name="person_search" size={32} color="var(--chart-2)" />
                  <p className="text-white/70 text-sm mt-2">No rider assigned yet</p>
                </div>
              )}
            </div>
          )}

          {/* Business */}
          <div className="bg-popover rounded-xl p-8 border border-border space-y-4">
            <h3 className="font-bold text-lg text-primary">Business</h3>
            <div className="flex items-center gap-3">
              {orderData.business.businessLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={orderData.business.businessLogo}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                  <MaterialIcon name="storefront" size={20} color="var(--primary)" />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-foreground truncate">{orderData.business.businessName}</p>
                <p className="text-xs text-muted-foreground truncate">{orderData.business.businessAddress}</p>
              </div>
            </div>
            <SummaryRow label="Contact" value={orderData.business.contactNumber} />
          </div>
        </div>
      </div>
    </div>
  )
}
