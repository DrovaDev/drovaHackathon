"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import MaterialIcon from "@/components/ui/material-icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useOrders } from "@/lib/order-context"
import { FormSection } from "@/components/orders"

const PACKAGE_TYPES = [
  "Documents", "Fragile Electronics", "Clothing", "Groceries",
  "Furniture", "Medical Supplies", "Automotive Parts", "Other",
] as const

type FormFields = {
  customerName: string
  customerPhone: string
  customerEmail: string
  pickupAddress: string
  deliveryAddress: string
  packageWeight: string
  packageType: string
  quantity: number
  insurance: boolean
  specialInstructions: string
  scheduledPickup: string
}

const INITIAL_FORM: FormFields = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  pickupAddress: "",
  deliveryAddress: "",
  packageWeight: "",
  packageType: "",
  quantity: 1,
  insurance: false,
  specialInstructions: "",
  scheduledPickup: "",
}

export default function CreateOrderPage() {
  const router = useRouter()
  const { dispatch } = useOrders()
  const [form, setForm] = useState<FormFields>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({})

  const updateField = useCallback(<K extends keyof FormFields>(field: K, value: FormFields[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const validate = useCallback((): boolean => {
    const errs: Partial<Record<keyof FormFields, string>> = {}
    if (!form.customerName.trim()) errs.customerName = "Customer name is required"
    if (!form.customerPhone.trim()) errs.customerPhone = "Phone number is required"
    if (!form.pickupAddress.trim()) errs.pickupAddress = "Pickup address is required"
    if (!form.deliveryAddress.trim()) errs.deliveryAddress = "Delivery address is required"
    if (!form.packageWeight.trim()) errs.packageWeight = "Weight is required"
    if (!form.packageType) errs.packageType = "Package type is required"
    if (!form.scheduledPickup) errs.scheduledPickup = "Pickup time is required"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }, [form])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    dispatch({ type: "ADD_ORDER", payload: form })
    router.push("/dashboard/orders")
  }

  return (
    <div className="px-8 lg:px-12 py-10">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <MaterialIcon name="arrow_back" size={18} />
          <span className="text-sm font-medium">Back to Orders</span>
        </button>
        <h2 className="text-3xl font-bold text-primary">Create New Order</h2>
        <p className="text-muted-foreground text-sm mt-1">Fill in the details below to schedule a new delivery.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <FormSection title="Customer Information" icon="person">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FieldWrapper label="Full Name *" error={errors.customerName}>
                  <Input
                    value={form.customerName}
                    onChange={(e) => updateField("customerName", e.target.value)}
                    className={errors.customerName ? "border-destructive" : "bg-silver-two"}
                    placeholder="e.g. John Doe"
                  />
                </FieldWrapper>
                <FieldWrapper label="Phone Number *" error={errors.customerPhone}>
                  <Input
                    value={form.customerPhone}
                    onChange={(e) => updateField("customerPhone", e.target.value)}
                    className={errors.customerPhone ? "border-destructive" : "bg-silver-two"}
                    placeholder="e.g. +1 (555) 000-0000"
                  />
                </FieldWrapper>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Email Address</Label>
                  <Input
                    type="email"
                    value={form.customerEmail}
                    onChange={(e) => updateField("customerEmail", e.target.value)}
                    className="bg-silver-two"
                    placeholder="e.g. customer@example.com"
                  />
                </div>
              </div>
            </FormSection>

            <FormSection title="Addresses" icon="location_on">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FieldWrapper label="Pickup Address *" error={errors.pickupAddress}>
                  <Textarea
                    value={form.pickupAddress}
                    onChange={(e) => updateField("pickupAddress", e.target.value)}
                    className={errors.pickupAddress ? "border-destructive" : "bg-silver-two"}
                    placeholder="Street, City, State"
                    rows={3}
                  />
                </FieldWrapper>
                <FieldWrapper label="Delivery Address *" error={errors.deliveryAddress}>
                  <Textarea
                    value={form.deliveryAddress}
                    onChange={(e) => updateField("deliveryAddress", e.target.value)}
                    className={errors.deliveryAddress ? "border-destructive" : "bg-silver-two"}
                    placeholder="Street, City, State"
                    rows={3}
                  />
                </FieldWrapper>
              </div>
            </FormSection>

            <FormSection title="Package Details" icon="inventory_2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FieldWrapper label="Weight *" error={errors.packageWeight}>
                  <Input
                    value={form.packageWeight}
                    onChange={(e) => updateField("packageWeight", e.target.value)}
                    className={errors.packageWeight ? "border-destructive" : "bg-silver-two"}
                    placeholder="e.g. 2.5 kg"
                  />
                </FieldWrapper>
                <FieldWrapper label="Package Type *" error={errors.packageType}>
                  <select
                    value={form.packageType}
                    onChange={(e) => updateField("packageType", e.target.value)}
                    className={`h-11 w-full rounded-lg border border-input bg-silver-two px-2.5 py-1 text-sm font-medium transition-colors outline-none focus-visible:border-secondary focus-visible:ring-3 focus-visible:ring-secondary/20 ${errors.packageType ? "border-destructive" : ""} ${!form.packageType ? "text-muted-foreground" : "text-foreground"}`}
                  >
                    <option value="" disabled>Select type...</option>
                    {PACKAGE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </FieldWrapper>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Quantity</Label>
                  <QuantityStepper value={form.quantity} onChange={(v) => updateField("quantity", v)} />
                </div>
                <div className="space-y-2 flex items-end pb-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div
                      onClick={() => updateField("insurance", !form.insurance)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${form.insurance ? "bg-secondary border-secondary" : "border-border bg-transparent"}`}
                    >
                      {form.insurance && <MaterialIcon name="check" size={14} color="white" />}
                    </div>
                    <span className="text-sm font-medium text-foreground">Include insurance coverage</span>
                  </label>
                </div>
              </div>
            </FormSection>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-8">
            <FormSection title="Scheduling" icon="schedule">
              <FieldWrapper label="Scheduled Pickup *" error={errors.scheduledPickup}>
                <Input
                  type="datetime-local"
                  value={form.scheduledPickup}
                  onChange={(e) => updateField("scheduledPickup", e.target.value)}
                  className={errors.scheduledPickup ? "border-destructive" : "bg-silver-two"}
                />
              </FieldWrapper>
            </FormSection>

            <FormSection title="Special Instructions" icon="edit_note">
              <Textarea
                value={form.specialInstructions}
                onChange={(e) => updateField("specialInstructions", e.target.value)}
                className="bg-silver-two"
                placeholder="Any special handling, gate codes, or delivery preferences..."
                rows={5}
              />
            </FormSection>

            <div className="bg-primary text-white rounded-xl p-8 border border-primary/20 space-y-4">
              <div className="flex items-center space-x-2">
                <MaterialIcon name="info" size={20} color="var(--chart-2)" />
                <h4 className="font-bold">Order Summary</h4>
              </div>
              <div className="space-y-2 text-sm">
                <SummaryRow label="Items" value={`${form.quantity} unit${form.quantity > 1 ? "s" : ""}`} />
                <SummaryRow label="Insurance" value={form.insurance ? "Yes" : "No"} />
                <SummaryRow label="Pickup" value={form.scheduledPickup || "Not set"} />
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-white/60 text-xs font-medium">Estimated fee</span>
                <span className="text-chart-2 font-bold text-lg">
                  ${(Math.random() * 80 + 15).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button type="button" variant="outline" size="default" className="flex-1" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" variant="default" size="default" className="flex-1">
                <MaterialIcon name="add" size={16} color="var(--primary-foreground)" />
                Create Order
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

function FieldWrapper({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{label}</Label>
      {children}
      {error && <p className="text-[10px] text-destructive font-medium">{error}</p>}
    </div>
  )
}

function QuantityStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="w-10 h-10 rounded-lg bg-silver-two flex items-center justify-center hover:bg-border transition-colors"
      >
        <MaterialIcon name="remove" size={18} />
      </button>
      <span className="w-12 text-center font-bold text-lg text-foreground">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-10 h-10 rounded-lg bg-silver-two flex items-center justify-center hover:bg-border transition-colors"
      >
        <MaterialIcon name="add" size={18} />
      </button>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/60">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  )
}
