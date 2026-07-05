export type QuotationStatus = "PENDING" | "INVOICED" | "EXPIRED" | "CANCELLED"

export interface Quotation {
  id: string
  senderName: string
  senderPhone: string
  senderEmail: string
  pickupAddress: string
  deliveryAddress: string
  packageType: string
  preferredDate: string
  submittedAt: string
  status: QuotationStatus
  amount?: string
  nombaPaymentLink?: string
}

export const mockQuotations: Quotation[] = [
  { id: "QUO-001", senderName: "Amara Obi", senderPhone: "08012345678", senderEmail: "amara@email.com", pickupAddress: "10 Adeola Odeku St, Victoria Island", deliveryAddress: "15 Allen Ave, Ikeja", packageType: "Documents", preferredDate: "2026-07-01", submittedAt: "2026-06-30 09:14", status: "PENDING" },
  { id: "QUO-002", senderName: "Fatima Bello", senderPhone: "08098765432", senderEmail: "fatima@email.com", pickupAddress: "3 Lekki Phase 1, Lagos", deliveryAddress: "22 Bode Thomas, Surulere", packageType: "Fragile", preferredDate: "2026-07-01", submittedAt: "2026-06-30 08:47", status: "PENDING" },
  { id: "QUO-003", senderName: "Emeka Nwosu", senderPhone: "07061234567", senderEmail: "emeka@email.com", pickupAddress: "5 Broad St, Lagos Island", deliveryAddress: "40 Market Rd, Oshodi", packageType: "Electronics", preferredDate: "2026-06-30", submittedAt: "2026-06-29 16:22", status: "INVOICED", amount: "₦8,500", nombaPaymentLink: "https://checkout.nomba.com/c/abc123" },
  { id: "QUO-004", senderName: "Ngozi Adeyemi", senderPhone: "08133456789", senderEmail: "ngozi@email.com", pickupAddress: "7 Awolowo Rd, Ikoyi", deliveryAddress: "Sangotedo, Ajah", packageType: "Clothing", preferredDate: "2026-06-28", submittedAt: "2026-06-27 11:05", status: "EXPIRED" },
  { id: "QUO-005", senderName: "Chidi Okafor", senderPhone: "08077654321", senderEmail: "chidi@email.com", pickupAddress: "12 CMD Rd, Magodo", deliveryAddress: "Festac Town, Lagos", packageType: "Food Items", preferredDate: "2026-07-02", submittedAt: "2026-06-30 10:01", status: "PENDING" },
]

export const quotationStatusConfig: Record<QuotationStatus, { label: string; bg: string; text: string }> = {
  PENDING: { label: "Pending", bg: "bg-amber-100", text: "text-amber-700" },
  INVOICED: { label: "Invoiced", bg: "bg-blue-100", text: "text-blue-700" },
  EXPIRED: { label: "Expired", bg: "bg-red-100", text: "text-red-600" },
  CANCELLED: { label: "Cancelled", bg: "bg-gray-100", text: "text-gray-500" },
}
