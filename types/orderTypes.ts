// Quotation lifecycle statuses
export type QuotationStatus = "PENDING" | "INVOICED" | "PAID" | "CANCELLED" | "EXPIRED"

// Full order lifecycle statuses per PRD
export type OrderStatus =
  | "CONFIRMED"
  | "ASSIGNED"
  | "EN_ROUTE_PICKUP"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "COMPLETED"
  | "DISPUTED"
  | "CANCELLED"

export type Note = {
  id: string
  text: string
  createdAt: string
  author: string
}

export type TimelineStep = {
  label: string
  time: string
  description: string
  completed?: boolean
  active?: boolean
  upcoming?: boolean
}

export type Quotation = {
  id: string
  senderName: string
  senderPhone: string
  senderEmail: string
  whatsappNumber?: string
  pickupAddress: string
  deliveryAddress: string
  packageType: string
  packageDescription?: string
  estimatedWeight?: string
  preferredDate: string
  additionalNotes?: string
  submittedAt: string
  status: QuotationStatus
  amount?: string
  invoiceExpiry?: string
  nombaCheckoutLink?: string
  nombaOrderReference?: string
}

export type Order = {
  id: string
  quotationId: string
  senderName: string
  senderPhone: string
  senderEmail: string
  pickupAddress: string
  deliveryAddress: string
  packageType: string
  packageDescription?: string
  estimatedWeight?: string
  assignedRiderId?: string
  assignedRiderName?: string
  status: OrderStatus
  amount: string
  nombaTxId?: string
  nombaTxRef?: string
  paymentMethod?: string
  paidAt?: string
  createdAt: string
  notes: Note[]
  timeline: TimelineStep[]
  deliveryProofUrl?: string
  deliveryPin?: string
}

export type Rider = {
  id: string
  name: string
  phone: string
  email: string
  vehicle: "Motorcycle" | "Van" | "Electric Moped"
  availability: "Available" | "On Delivery" | "Offline"
  bankAccountNumber?: string
  bankCode?: string
  bankName?: string
  totalDeliveries: number
  completionRate: number
  rating: number
  pendingEarnings: string
  joinedAt: string
}

// Re-export API rider types for convenience
export type { RiderProfile, RiderAvailabilityStatus } from "@/api/types/rider.types"

export type WithdrawalRecord = {
  id: string
  amount: number
  bankName: string
  accountNumber: string
  accountName: string
  bankCode: string
  merchantTxRef: string
  nombaTxRef?: string
  status: "PENDING" | "PROCESSED" | "FAILED"
  createdAt: string
}
