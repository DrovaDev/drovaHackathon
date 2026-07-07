"use client"

import { useState, type ReactNode } from "react"
import type { AxiosError } from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import MaterialIcon from "@/components/ui/material-icon"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectItem,
} from "@/components/ui/select"
import { AddressMapPicker } from "@/components/orders/address-map-picker"
import { matchState } from "@/lib/match-state"
import { business, order } from "@/services/router"
import type { OrderDeliveryPriority, OrderPickupMethod } from "@/services/types/order.types"

type ItemForm = {
  packageName: string
  packageDescription: string
  packageType: string
  quantity: string
  estimatedValue: string
  estimatedWeight: string
  specialInstructions: string
}

const EMPTY_ITEM: ItemForm = {
  packageName: "",
  packageDescription: "",
  packageType: "",
  quantity: "1",
  estimatedValue: "",
  estimatedWeight: "",
  specialInstructions: "",
}

type Props = {
  open: boolean
  onClose: () => void
  businessSlug: string
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{label}</Label>
      {children}
    </div>
  )
}

export function RequestQuotationModal({ open, onClose, businessSlug }: Props) {
  const { data: lookupsResponse, isLoading: isStatesLoading } = business.getBusinessLookups.useQuery({
    enabled: open,
  })
  const states = lookupsResponse?.data?.states ?? []

  const [pickupMethod, setPickupMethod] = useState<OrderPickupMethod>("business_pickup")
  const [deliveryPriority, setDeliveryPriority] = useState<OrderDeliveryPriority>("express")
  const [preferredDeliveryTime, setPreferredDeliveryTime] = useState("")
  const [customerNote, setCustomerNote] = useState("")
  const [pickupInstructions, setPickupInstructions] = useState("")
  const [deliveryInstructions, setDeliveryInstructions] = useState("")

  const [guestFullName, setGuestFullName] = useState("")
  const [guestContactNumber, setGuestContactNumber] = useState("")
  const [guestEmail, setGuestEmail] = useState("")

  const [recipientFullName, setRecipientFullName] = useState("")
  const [recipientContactNumber, setRecipientContactNumber] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")

  const [pickupAddress, setPickupAddress] = useState("")
  const [pickupLongitude, setPickupLongitude] = useState("")
  const [pickupLatitude, setPickupLatitude] = useState("")
  const [pickupCity, setPickupCity] = useState("")
  const [pickupState, setPickupState] = useState("")
  const [pickupNearestLandmark, setPickupNearestLandmark] = useState("")
  const [pickupContactPersonName, setPickupContactPersonName] = useState("")
  const [pickupContactPersonPhoneNumber, setPickupContactPersonPhoneNumber] = useState("")

  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [deliveryLongitude, setDeliveryLongitude] = useState("")
  const [deliveryLatitude, setDeliveryLatitude] = useState("")
  const [deliveryState, setDeliveryState] = useState("")
  const [deliveryNearestLandmark, setDeliveryNearestLandmark] = useState("")

  const [items, setItems] = useState<ItemForm[]>([{ ...EMPTY_ITEM }])
  const [submittedReference, setSubmittedReference] = useState<string | null>(null)

  const resetForm = () => {
    setPickupMethod("business_pickup")
    setDeliveryPriority("express")
    setPreferredDeliveryTime("")
    setCustomerNote("")
    setPickupInstructions("")
    setDeliveryInstructions("")
    setGuestFullName("")
    setGuestContactNumber("")
    setGuestEmail("")
    setRecipientFullName("")
    setRecipientContactNumber("")
    setRecipientEmail("")
    setPickupAddress("")
    setPickupLongitude("")
    setPickupLatitude("")
    setPickupCity("")
    setPickupState("")
    setPickupNearestLandmark("")
    setPickupContactPersonName("")
    setPickupContactPersonPhoneNumber("")
    setDeliveryAddress("")
    setDeliveryLongitude("")
    setDeliveryLatitude("")
    setDeliveryState("")
    setDeliveryNearestLandmark("")
    setItems([{ ...EMPTY_ITEM }])
    setSubmittedReference(null)
  }

  const createQuotationMutation = order.createQuotation.useMutation({
    onSuccess: (response) => {
      toast.success(response.message || "Quotation request submitted")
      setSubmittedReference(response.data?.referenceCode ?? null)
    },
    onError: (error) => {
      toast.error(
        (error as AxiosError<{ message: string }>).response?.data?.message ||
          "Failed to submit quotation request",
      )
    },
  })

  const updateItem = (index: number, patch: Partial<ItemForm>) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  const addItem = () => setItems((prev) => [...prev, { ...EMPTY_ITEM }])
  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index))

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const isValid =
    guestFullName.trim() !== "" &&
    guestContactNumber.trim() !== "" &&
    guestEmail.trim() !== "" &&
    recipientFullName.trim() !== "" &&
    recipientContactNumber.trim() !== "" &&
    recipientEmail.trim() !== "" &&
    pickupAddress.trim() !== "" &&
    pickupCity.trim() !== "" &&
    pickupState.trim() !== "" &&
    pickupLongitude !== "" &&
    pickupLatitude !== "" &&
    deliveryAddress.trim() !== "" &&
    deliveryState.trim() !== "" &&
    deliveryLongitude !== "" &&
    deliveryLatitude !== "" &&
    items.length > 0 &&
    items.every(
      (item) =>
        item.packageName.trim() !== "" &&
        item.packageType.trim() !== "" &&
        item.quantity !== "" &&
        item.estimatedValue !== "" &&
        item.estimatedWeight !== "",
    )

  const handleSubmit = () => {
    if (!isValid) return
    createQuotationMutation.mutate({
      pickupMethod,
      deliveryPriority,
      preferredDeliveryTime: preferredDeliveryTime
        ? new Date(preferredDeliveryTime).toISOString()
        : undefined,
      customerNote: customerNote.trim() || undefined,
      senderDetails: {
        guestFullName: guestFullName.trim(),
        guestContactNumber: guestContactNumber.trim(),
        guestEmail: guestEmail.trim(),
      },
      recipientDetails: {
        recipientFullName: recipientFullName.trim(),
        recipientContactNumber: recipientContactNumber.trim(),
        recipientEmail: recipientEmail.trim(),
      },
      pickupDetails: {
        pickupAddress: pickupAddress.trim(),
        pickupCoordinates: [Number(pickupLongitude), Number(pickupLatitude)],
        pickupCity: pickupCity.trim(),
        pickupState: pickupState.trim(),
        pickupNearestLandmark: pickupNearestLandmark.trim() || undefined,
        pickupContactPersonName: pickupContactPersonName.trim() || undefined,
        pickupContactPersonPhoneNumber: pickupContactPersonPhoneNumber.trim() || undefined,
      },
      deliveryDetails: {
        deliveryAddress: deliveryAddress.trim(),
        deliveryCoordinates: [Number(deliveryLongitude), Number(deliveryLatitude)],
        deliveryState: deliveryState.trim(),
        deliveryNearestLandmark: deliveryNearestLandmark.trim() || undefined,
      },
      items: items.map((item) => ({
        packageName: item.packageName.trim(),
        packageDescription: item.packageDescription.trim(),
        packageType: item.packageType.trim(),
        quantity: Number(item.quantity) || 1,
        estimatedValue: Number(item.estimatedValue) || 0,
        estimatedWeight: Number(item.estimatedWeight) || 0,
        specialInstructions: item.specialInstructions.trim() || undefined,
      })),
      pickupInstructions: pickupInstructions.trim() || undefined,
      deliveryInstructions: deliveryInstructions.trim() || undefined,
      businessSlug,
    })
  }

  if (!open) return null

  if (submittedReference) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-popover rounded-2xl border border-border w-full max-w-md shadow-2xl p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
            <MaterialIcon name="check_circle" size={28} color="var(--secondary)" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary">Quotation Requested</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Your request has been sent to the business. They&apos;ll reach out with pricing shortly.
            </p>
          </div>
          <div className="bg-silver-two rounded-xl px-4 py-3">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reference Code</p>
            <p className="text-sm font-mono font-bold text-foreground mt-0.5">{submittedReference}</p>
          </div>
          <Button className="w-full" onClick={handleClose}>
            Done
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-popover rounded-2xl border border-border w-full max-w-3xl max-h-[90vh] shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <div>
            <h3 className="text-lg font-bold text-primary">Request a Quotation</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tell us about your delivery and we&apos;ll get back to you with pricing.
            </p>
          </div>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
            <MaterialIcon name="close" size={20} color="var(--muted-foreground)" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Sender */}
          <section className="space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Your Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Full Name">
                <Input value={guestFullName} onChange={(e) => setGuestFullName(e.target.value)} className="bg-silver-two border-0" />
              </Field>
              <Field label="Phone Number">
                <Input value={guestContactNumber} onChange={(e) => setGuestContactNumber(e.target.value)} className="bg-silver-two border-0" placeholder="+234..." />
              </Field>
              <Field label="Email">
                <Input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} className="bg-silver-two border-0" />
              </Field>
            </div>
          </section>

          {/* Recipient */}
          <section className="space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Recipient Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Full Name">
                <Input value={recipientFullName} onChange={(e) => setRecipientFullName(e.target.value)} className="bg-silver-two border-0" />
              </Field>
              <Field label="Phone Number">
                <Input value={recipientContactNumber} onChange={(e) => setRecipientContactNumber(e.target.value)} className="bg-silver-two border-0" placeholder="+234..." />
              </Field>
              <Field label="Email">
                <Input type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} className="bg-silver-two border-0" />
              </Field>
            </div>
          </section>

          {/* Pickup */}
          <section className="space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Pickup Details</h4>
            <Field label="Pickup Address">
              <AddressMapPicker
                markerColor="primary"
                placeholder="Search for the pickup address..."
                value={{
                  address: pickupAddress,
                  longitude: pickupLongitude !== "" ? Number(pickupLongitude) : null,
                  latitude: pickupLatitude !== "" ? Number(pickupLatitude) : null,
                }}
                onChange={(next) => {
                  setPickupAddress(next.address)
                  setPickupLongitude(String(next.longitude))
                  setPickupLatitude(String(next.latitude))
                  if (next.city) setPickupCity(next.city)
                  const matchedState = matchState(next.state, states)
                  if (matchedState) setPickupState(matchedState)
                }}
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="City">
                <Input value={pickupCity} onChange={(e) => setPickupCity(e.target.value)} className="bg-silver-two border-0" />
              </Field>
              <Field label="State">
                <Select value={pickupState} onValueChange={setPickupState} disabled={isStatesLoading}>
                  <SelectTrigger className="bg-silver-two border-0">
                    <SelectValue placeholder={isStatesLoading ? "Loading states..." : "Select a state"} />
                  </SelectTrigger>
                  <SelectPopup>
                    {states.map(({ key, value }) => (
                      <SelectItem key={key} value={value}>{value}</SelectItem>
                    ))}
                  </SelectPopup>
                </Select>
              </Field>
              <Field label="Nearest Landmark (optional)">
                <Input value={pickupNearestLandmark} onChange={(e) => setPickupNearestLandmark(e.target.value)} className="bg-silver-two border-0" />
              </Field>
              <Field label="Contact Person Name (optional)">
                <Input value={pickupContactPersonName} onChange={(e) => setPickupContactPersonName(e.target.value)} className="bg-silver-two border-0" />
              </Field>
              <Field label="Contact Person Phone (optional)">
                <Input value={pickupContactPersonPhoneNumber} onChange={(e) => setPickupContactPersonPhoneNumber(e.target.value)} className="bg-silver-two border-0" />
              </Field>
            </div>
          </section>

          {/* Delivery */}
          <section className="space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Delivery Details</h4>
            <Field label="Delivery Address">
              <AddressMapPicker
                markerColor="secondary"
                placeholder="Search for the delivery address..."
                value={{
                  address: deliveryAddress,
                  longitude: deliveryLongitude !== "" ? Number(deliveryLongitude) : null,
                  latitude: deliveryLatitude !== "" ? Number(deliveryLatitude) : null,
                }}
                onChange={(next) => {
                  setDeliveryAddress(next.address)
                  setDeliveryLongitude(String(next.longitude))
                  setDeliveryLatitude(String(next.latitude))
                  const matchedState = matchState(next.state, states)
                  if (matchedState) setDeliveryState(matchedState)
                }}
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="State">
                <Select value={deliveryState} onValueChange={setDeliveryState} disabled={isStatesLoading}>
                  <SelectTrigger className="bg-silver-two border-0">
                    <SelectValue placeholder={isStatesLoading ? "Loading states..." : "Select a state"} />
                  </SelectTrigger>
                  <SelectPopup>
                    {states.map(({ key, value }) => (
                      <SelectItem key={key} value={value}>{value}</SelectItem>
                    ))}
                  </SelectPopup>
                </Select>
              </Field>
              <Field label="Nearest Landmark (optional)">
                <Input value={deliveryNearestLandmark} onChange={(e) => setDeliveryNearestLandmark(e.target.value)} className="bg-silver-two border-0" />
              </Field>
            </div>
          </section>

          {/* Items */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Package Items</h4>
              <button onClick={addItem} className="text-xs font-bold text-secondary hover:underline flex items-center gap-1">
                <MaterialIcon name="add" size={14} color="var(--secondary)" />
                Add Item
              </button>
            </div>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="border border-border rounded-xl p-4 space-y-3 relative">
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(idx)}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"
                    >
                      <MaterialIcon name="close" size={16} color="currentColor" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Package Name">
                      <Input value={item.packageName} onChange={(e) => updateItem(idx, { packageName: e.target.value })} className="bg-silver-two border-0" />
                    </Field>
                    <Field label="Package Type">
                      <Input value={item.packageType} onChange={(e) => updateItem(idx, { packageType: e.target.value })} className="bg-silver-two border-0" placeholder="e.g. electronics" />
                    </Field>
                  </div>
                  <Field label="Description">
                    <Textarea value={item.packageDescription} onChange={(e) => updateItem(idx, { packageDescription: e.target.value })} className="bg-silver-two border-0" rows={2} />
                  </Field>
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Quantity">
                      <Input type="number" min={1} value={item.quantity} onChange={(e) => updateItem(idx, { quantity: e.target.value })} className="bg-silver-two border-0" />
                    </Field>
                    <Field label="Est. Value (₦)">
                      <Input type="number" value={item.estimatedValue} onChange={(e) => updateItem(idx, { estimatedValue: e.target.value })} className="bg-silver-two border-0" />
                    </Field>
                    <Field label="Weight (kg)">
                      <Input type="number" value={item.estimatedWeight} onChange={(e) => updateItem(idx, { estimatedWeight: e.target.value })} className="bg-silver-two border-0" />
                    </Field>
                  </div>
                  <Field label="Special Instructions (optional)">
                    <Input value={item.specialInstructions} onChange={(e) => updateItem(idx, { specialInstructions: e.target.value })} className="bg-silver-two border-0" />
                  </Field>
                </div>
              ))}
            </div>
          </section>

          {/* Delivery preferences */}
          <section className="space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Delivery Preferences</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Pickup Method">
                <Select
                  value={pickupMethod}
                  onValueChange={(v) => setPickupMethod(v as OrderPickupMethod)}
                  items={[
                    { value: "business_pickup", label: "Business Pickup" },
                    { value: "walk_in", label: "Walk-in" },
                  ]}
                >
                  <SelectTrigger className="bg-silver-two border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectPopup>
                    <SelectItem value="business_pickup">Business Pickup</SelectItem>
                    <SelectItem value="walk_in">Walk-in</SelectItem>
                  </SelectPopup>
                </Select>
              </Field>
              <Field label="Delivery Priority">
                <Select
                  value={deliveryPriority}
                  onValueChange={(v) => setDeliveryPriority(v as OrderDeliveryPriority)}
                  items={[
                    { value: "express", label: "Express" },
                    { value: "scheduled", label: "Scheduled" },
                  ]}
                >
                  <SelectTrigger className="bg-silver-two border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectPopup>
                    <SelectItem value="express">Express</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectPopup>
                </Select>
              </Field>
            </div>
            <Field label="Preferred Delivery Time (optional)">
              <Input type="datetime-local" value={preferredDeliveryTime} onChange={(e) => setPreferredDeliveryTime(e.target.value)} className="bg-silver-two border-0" />
            </Field>
            <Field label="Pickup Instructions (optional)">
              <Textarea value={pickupInstructions} onChange={(e) => setPickupInstructions(e.target.value)} className="bg-silver-two border-0" rows={2} />
            </Field>
            <Field label="Delivery Instructions (optional)">
              <Textarea value={deliveryInstructions} onChange={(e) => setDeliveryInstructions(e.target.value)} className="bg-silver-two border-0" rows={2} />
            </Field>
            <Field label="Note to Business (optional)">
              <Textarea value={customerNote} onChange={(e) => setCustomerNote(e.target.value)} className="bg-silver-two border-0" rows={2} />
            </Field>
          </section>
        </div>

        <div className="flex gap-3 px-6 py-5 border-t border-border shrink-0">
          <Button variant="ghost" className="flex-1" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={!isValid || createQuotationMutation.isPending}
            onClick={handleSubmit}
          >
            {createQuotationMutation.isPending ? "Submitting..." : "Request Quotation"}
          </Button>
        </div>
      </div>
    </div>
  )
}
