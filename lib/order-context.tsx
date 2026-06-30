"use client"

import { createContext, useContext, useReducer, useCallback, type ReactNode } from "react"
// Local types for the legacy order detail view (separate from the new PRD lifecycle types)
type OrderStatus = "Pending" | "Assigned" | "In-Transit" | "Delivered" | "Cancelled"

type Note = {
  id: string
  text: string
  createdAt: string
  author: string
}

type TimelineStep = {
  label: string
  time: string
  description: string
  completed?: boolean
  active?: boolean
  upcoming?: boolean
}

type Order = {
  id: string
  customerName: string
  customerPhone: string
  customerEmail: string
  initials: string
  location: string
  pickupAddress: string
  deliveryAddress: string
  packageWeight: string
  packageType: string
  quantity: number
  insurance: string
  specialInstructions: string
  status: OrderStatus
  createdAt: string
  createdTime: string
  scheduledPickup: string
  riderName?: string
  riderRating?: number
  riderDeliveries?: number
  riderVehicle?: string
  riderLicense?: string
  amount: string
  notes: Note[]
  timeline: TimelineStep[]
}

type CreateOrderInput = {
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

function generateOrderId(): string {
  const num = Math.floor(Math.random() * 9000) + 1000
  const suffix = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26))
  return `DRV-${num}-${suffix}`
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
}

const seedOrders: Order[] = [
  {
    id: "DRV-8821",
    customerName: "Johnathan Doe",
    customerPhone: "+234 801 234 5678",
    customerEmail: "johnathan.doe@email.com",
    initials: "JD",
    location: "Lagos, NG",
    pickupAddress: "42 Marina Road, Lagos Island",
    deliveryAddress: "15 Bourdillon Street, Ikoyi, Lagos",
    packageWeight: "2.5 kg",
    packageType: "Documents",
    quantity: 1,
    insurance: "Not Covered",
    specialInstructions: "Leave with security desk",
    status: "Delivered",
    createdAt: "Oct 29, 2023",
    createdTime: "14:22 PM",
    scheduledPickup: "Oct 29, 2023 10:00 AM",
    riderName: "Emeka Okafor",
    riderRating: 4.8,
    riderDeliveries: 1820,
    riderVehicle: "Motorcycle (BY-772)",
    riderLicense: "LAG-887-KL",
    amount: "$450.00",
    notes: [
      { id: "n1", text: "Customer prefers morning deliveries.", createdAt: "Oct 28, 2023", author: "Admin" },
    ],
    timeline: [
      { label: "Order Placed", time: "Oct 29, 10:00 AM", description: "Order received and processed.", completed: true },
      { label: "Package Picked Up", time: "Oct 29, 11:30 AM", description: "Emeka picked up from sender.", completed: true },
      { label: "In Transit", time: "Oct 29, 01:00 PM", description: "En route to Ikoyi.", completed: true },
      { label: "Delivered", time: "Oct 29, 02:22 PM", description: "Signed for by recipient.", active: true },
    ],
  },
  {
    id: "DRV-8822",
    customerName: "Sarah Adewale",
    customerPhone: "+234 803 456 7890",
    customerEmail: "sarah.a@example.com",
    initials: "SA",
    location: "Abuja, NG",
    pickupAddress: "88 Aminu Kano Crescent, Wuse II",
    deliveryAddress: "23 Gana Street, Maitama, Abuja",
    packageWeight: "5.0 kg",
    packageType: "Fragile Electronics",
    quantity: 2,
    insurance: "Covered ($1,500)",
    specialInstructions: "Fragile - handle with extreme care. Do not stack.",
    status: "In-Transit",
    createdAt: "Oct 30, 2023",
    createdTime: "09:15 AM",
    scheduledPickup: "Oct 30, 2023 08:00 AM",
    riderName: "Blessing Adeyemi",
    riderRating: 4.9,
    riderDeliveries: 2104,
    riderVehicle: "E-Van (EV-301)",
    riderLicense: "ABJ-442-MP",
    amount: "$1,220.50",
    notes: [],
    timeline: [
      { label: "Order Placed", time: "Oct 30, 08:00 AM", description: "Order received and processed.", completed: true },
      { label: "Package Picked Up", time: "Oct 30, 09:15 AM", description: "Blessing verified and loaded shipment.", completed: true },
      { label: "In Transit", time: "Currently on route", description: "Passing Wuse market area.", active: true },
      { label: "Delivered", time: "Expected by 12:30 PM", description: "", upcoming: true },
    ],
  },
  {
    id: "DRV-8823",
    customerName: "Kofi Thompson",
    customerPhone: "+233 501 234 567",
    customerEmail: "kofi.t@example.com",
    initials: "KT",
    location: "Accra, GH",
    pickupAddress: "5 Independence Avenue, Ridge",
    deliveryAddress: "12 Osu Badu Street, Osu, Accra",
    packageWeight: "1.2 kg",
    packageType: "Clothing",
    quantity: 3,
    insurance: "Not Covered",
    specialInstructions: "Call before delivery",
    status: "Pending",
    createdAt: "Oct 30, 2023",
    createdTime: "16:45 PM",
    scheduledPickup: "Oct 31, 2023 09:00 AM",
    amount: "$85.20",
    notes: [],
    timeline: [
      { label: "Order Placed", time: "Oct 30, 04:45 PM", description: "Awaiting rider assignment.", active: true },
      { label: "Package Picked Up", time: "Pending", description: "", upcoming: true },
      { label: "In Transit", time: "", description: "", upcoming: true },
      { label: "Delivered", time: "", description: "", upcoming: true },
    ],
  },
  {
    id: "DRV-8824",
    customerName: "Miriam Egbe",
    customerPhone: "+234 805 678 9012",
    customerEmail: "miriam.e@example.com",
    initials: "ME",
    location: "Enugu, NG",
    pickupAddress: "7 Market Road, Enugu Urban",
    deliveryAddress: "19 Presidential Road, Enugu",
    packageWeight: "8.0 kg",
    packageType: "Groceries",
    quantity: 1,
    insurance: "Not Covered",
    specialInstructions: "Deliver to kitchen entrance at the back",
    status: "Assigned",
    createdAt: "Oct 31, 2023",
    createdTime: "11:00 AM",
    scheduledPickup: "Oct 31, 2023 02:00 PM",
    riderName: "Chidi Nwosu",
    riderRating: 4.7,
    riderDeliveries: 956,
    riderVehicle: "Pickup (EN-550)",
    riderLicense: "ENU-119-XZ",
    amount: "$2,100.00",
    notes: [],
    timeline: [
      { label: "Order Placed", time: "Oct 31, 11:00 AM", description: "Order received.", completed: true },
      { label: "Package Picked Up", time: "Pending pickup", description: "Rider assigned - Chidi Nwosu", active: true },
      { label: "In Transit", time: "", description: "", upcoming: true },
      { label: "Delivered", time: "", description: "", upcoming: true },
    ],
  },
  {
    id: "DRV-8825",
    customerName: "Amina Hassan",
    customerPhone: "+254 712 345 678",
    customerEmail: "amina.h@example.com",
    initials: "AH",
    location: "Nairobi, KE",
    pickupAddress: "14 Kenyatta Avenue, Nairobi CBD",
    deliveryAddress: "88 Langata Road, Nairobi",
    packageWeight: "3.2 kg",
    packageType: "Fragile Electronics",
    quantity: 1,
    insurance: "Covered ($800)",
    specialInstructions: "Fragile — do not flip upside down",
    status: "Delivered",
    createdAt: "Nov 1, 2023",
    createdTime: "08:30 AM",
    scheduledPickup: "Nov 1, 2023 09:00 AM",
    riderName: "James Mwangi",
    riderRating: 4.6,
    riderDeliveries: 1340,
    riderVehicle: "Motorcycle (NB-209)",
    riderLicense: "NBI-774-KL",
    amount: "$320.00",
    notes: [
      { id: "n2", text: "Customer requested morning delivery window.", createdAt: "Oct 31, 2023", author: "Admin" },
    ],
    timeline: [
      { label: "Order Placed", time: "Nov 1, 08:30 AM", description: "Order received and processed.", completed: true },
      { label: "Package Picked Up", time: "Nov 1, 09:45 AM", description: "James picked up from sender.", completed: true },
      { label: "In Transit", time: "Nov 1, 10:30 AM", description: "En route to Langata Road.", completed: true },
      { label: "Delivered", time: "Nov 1, 11:15 AM", description: "Signed for by recipient.", active: true },
    ],
  },
  {
    id: "DRV-8826",
    customerName: "Tunde Bakare",
    customerPhone: "+234 809 876 5432",
    customerEmail: "tunde.b@example.com",
    initials: "TB",
    location: "Lagos, NG",
    pickupAddress: "3 Admiralty Way, Lekki Phase 1",
    deliveryAddress: "17 Adeola Odeku Street, Victoria Island",
    packageWeight: "12.0 kg",
    packageType: "Furniture",
    quantity: 1,
    insurance: "Covered ($3,000)",
    specialInstructions: "White-glove delivery required. Two-person team.",
    status: "In-Transit",
    createdAt: "Nov 1, 2023",
    createdTime: "14:00 PM",
    scheduledPickup: "Nov 1, 2023 03:00 PM",
    riderName: "Olumide Adekunle",
    riderRating: 4.8,
    riderDeliveries: 2890,
    riderVehicle: "Van (LA-112-XY)",
    riderLicense: "LAG-553-MN",
    amount: "$1,850.00",
    notes: [],
    timeline: [
      { label: "Order Placed", time: "Nov 1, 02:00 PM", description: "Order received.", completed: true },
      { label: "Package Picked Up", time: "Nov 1, 03:20 PM", description: "Olumide loaded furniture into van.", completed: true },
      { label: "In Transit", time: "Currently on route", description: "Crossing Third Mainland Bridge.", active: true },
      { label: "Delivered", time: "Expected by 05:00 PM", description: "", upcoming: true },
    ],
  },
  {
    id: "DRV-8827",
    customerName: "Fatima Al-Rashid",
    customerPhone: "+971 50 123 4567",
    customerEmail: "fatima.r@example.com",
    initials: "FA",
    location: "Dubai, AE",
    pickupAddress: "25 Sheikh Zayed Road, DIFC",
    deliveryAddress: "42 Jumeirah Beach Road, JBR",
    packageWeight: "0.8 kg",
    packageType: "Documents",
    quantity: 5,
    insurance: "Not Covered",
    specialInstructions: "Urgent legal documents. Handle with care.",
    status: "Pending",
    createdAt: "Nov 2, 2023",
    createdTime: "10:15 AM",
    scheduledPickup: "Nov 2, 2023 11:00 AM",
    amount: "$95.00",
    notes: [],
    timeline: [
      { label: "Order Placed", time: "Nov 2, 10:15 AM", description: "Awaiting rider assignment.", active: true },
      { label: "Package Picked Up", time: "Pending", description: "", upcoming: true },
      { label: "In Transit", time: "", description: "", upcoming: true },
      { label: "Delivered", time: "", description: "", upcoming: true },
    ],
  },
  {
    id: "DRV-8828",
    customerName: "Chiamaka Obi",
    customerPhone: "+234 811 234 5678",
    customerEmail: "chiamaka.o@example.com",
    initials: "CO",
    location: "Lagos, NG",
    pickupAddress: "5 Allen Avenue, Ikeja",
    deliveryAddress: "29 Opebi Road, Ikeja",
    packageWeight: "2.0 kg",
    packageType: "Clothing",
    quantity: 2,
    insurance: "Not Covered",
    specialInstructions: "Leave with reception if not available",
    status: "Delivered",
    createdAt: "Nov 2, 2023",
    createdTime: "07:45 AM",
    scheduledPickup: "Nov 2, 2023 08:00 AM",
    riderName: "Emeka Okafor",
    riderRating: 4.8,
    riderDeliveries: 1820,
    riderVehicle: "Motorcycle (BY-772)",
    riderLicense: "LAG-887-KL",
    amount: "$175.50",
    notes: [],
    timeline: [
      { label: "Order Placed", time: "Nov 2, 07:45 AM", description: "Order received.", completed: true },
      { label: "Package Picked Up", time: "Nov 2, 08:30 AM", description: "Emeka picked up from Allen Avenue.", completed: true },
      { label: "In Transit", time: "Nov 2, 09:00 AM", description: "Short route across Ikeja.", completed: true },
      { label: "Delivered", time: "Nov 2, 09:20 AM", description: "Left with reception desk.", active: true },
    ],
  },
  {
    id: "DRV-8829",
    customerName: "Youssef Mensah",
    customerPhone: "+233 24 567 8901",
    customerEmail: "youssef.m@example.com",
    initials: "YM",
    location: "Kumasi, GH",
    pickupAddress: "10 Adum Street, Kumasi Central",
    deliveryAddress: "33 Ahodwo Road, Nhyiaeso",
    packageWeight: "6.5 kg",
    packageType: "Medical Supplies",
    quantity: 1,
    insurance: "Covered ($2,000)",
    specialInstructions: "Temperature-sensitive. Keep cool.",
    status: "Assigned",
    createdAt: "Nov 2, 2023",
    createdTime: "13:30 PM",
    scheduledPickup: "Nov 2, 2023 02:00 PM",
    riderName: "Kwame Asante",
    riderRating: 4.5,
    riderDeliveries: 678,
    riderVehicle: "Van (AS-301)",
    riderLicense: "KMS-221-AB",
    amount: "$430.75",
    notes: [],
    timeline: [
      { label: "Order Placed", time: "Nov 2, 01:30 PM", description: "Order received.", completed: true },
      { label: "Package Picked Up", time: "Pending pickup", description: "Rider assigned - Kwame Asante.", active: true },
      { label: "In Transit", time: "", description: "", upcoming: true },
      { label: "Delivered", time: "", description: "", upcoming: true },
    ],
  },
  {
    id: "DRV-8830",
    customerName: "Nalini Sharma",
    customerPhone: "+91 98765 43210",
    customerEmail: "nalini.s@example.com",
    initials: "NS",
    location: "Mumbai, IN",
    pickupAddress: "72 Andheri Kurla Road, Andheri East",
    deliveryAddress: "15 Bandra West, Hill Road",
    packageWeight: "4.0 kg",
    packageType: "Groceries",
    quantity: 3,
    insurance: "Not Covered",
    specialInstructions: "Perishable items. Deliver within 2 hours.",
    status: "In-Transit",
    createdAt: "Nov 3, 2023",
    createdTime: "06:00 AM",
    scheduledPickup: "Nov 3, 2023 06:30 AM",
    riderName: "Raj Patel",
    riderRating: 4.7,
    riderDeliveries: 1567,
    riderVehicle: "Motorcycle (MH-445)",
    riderLicense: "MUM-662-TK",
    amount: "$62.30",
    notes: [],
    timeline: [
      { label: "Order Placed", time: "Nov 3, 06:00 AM", description: "Order received.", completed: true },
      { label: "Package Picked Up", time: "Nov 3, 06:45 AM", description: "Raj loaded perishables.", completed: true },
      { label: "In Transit", time: "Currently on route", description: "Crossing Bandra-Worli Sea Link.", active: true },
      { label: "Delivered", time: "Expected by 08:30 AM", description: "", upcoming: true },
    ],
  },
  {
    id: "DRV-8831",
    customerName: "David Okonkwo",
    customerPhone: "+234 802 345 6789",
    customerEmail: "david.o@example.com",
    initials: "DO",
    location: "Port Harcourt, NG",
    pickupAddress: "20 Aba Road, Port Harcourt",
    deliveryAddress: "9 Trans-Amadi Road, Port Harcourt",
    packageWeight: "15.0 kg",
    packageType: "Automotive Parts",
    quantity: 2,
    insurance: "Covered ($5,000)",
    specialInstructions: "Heavy item. Forklift required at delivery.",
    status: "Pending",
    createdAt: "Nov 3, 2023",
    createdTime: "11:20 AM",
    scheduledPickup: "Nov 3, 2023 01:00 PM",
    amount: "$2,340.00",
    notes: [],
    timeline: [
      { label: "Order Placed", time: "Nov 3, 11:20 AM", description: "Awaiting rider assignment.", active: true },
      { label: "Package Picked Up", time: "Pending", description: "", upcoming: true },
      { label: "In Transit", time: "", description: "", upcoming: true },
      { label: "Delivered", time: "", description: "", upcoming: true },
    ],
  },
]

type State = {
  orders: Order[]
  searchQuery: string
}

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "ADD_ORDER"; payload: CreateOrderInput }
  | { type: "UPDATE_STATUS"; payload: { orderId: string; status: OrderStatus } }
  | { type: "ADD_NOTE"; payload: { orderId: string; text: string } }
  | { type: "DELETE_ORDER"; payload: string }

function orderReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload }
    case "ADD_ORDER": {
      const now = new Date()
      const input = action.payload
      const newOrder: Order = {
        id: generateOrderId(),
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        customerEmail: input.customerEmail,
        initials: getInitials(input.customerName),
        location: input.pickupAddress.split(",").pop()?.trim() || "N/A",
        pickupAddress: input.pickupAddress,
        deliveryAddress: input.deliveryAddress,
        packageWeight: input.packageWeight,
        packageType: input.packageType,
        quantity: input.quantity,
        insurance: input.insurance ? "Covered" : "Not Covered",
        specialInstructions: input.specialInstructions,
        status: "Pending",
        createdAt: formatDate(now),
        createdTime: formatTime(now),
        scheduledPickup: input.scheduledPickup,
        amount: `$${(Math.random() * 500 + 20).toFixed(2)}`,
        notes: [],
        timeline: [
          { label: "Order Placed", time: `${formatDate(now)}, ${formatTime(now)}`, description: "Awaiting rider assignment.", active: true },
          { label: "Package Picked Up", time: "Pending", description: "", upcoming: true },
          { label: "In Transit", time: "", description: "", upcoming: true },
          { label: "Delivered", time: "", description: "", upcoming: true },
        ],
      }
      return { ...state, orders: [newOrder, ...state.orders] }
    }
    case "UPDATE_STATUS": {
      const { orderId, status } = action.payload
      return {
        ...state,
        orders: state.orders.map((o) => {
          if (o.id !== orderId) return o
          const timeline = updateTimelineForStatus(o.timeline, status)
          return { ...o, status, timeline }
        }),
      }
    }
    case "ADD_NOTE": {
      const { orderId, text } = action.payload
      return {
        ...state,
        orders: state.orders.map((o) => {
          if (o.id !== orderId) return o
          const note: Note = {
            id: `n${Date.now()}`,
            text,
            createdAt: formatDate(new Date()),
            author: "You",
          }
          return { ...o, notes: [...o.notes, note] }
        }),
      }
    }
    case "DELETE_ORDER":
      return { ...state, orders: state.orders.filter((o) => o.id !== action.payload) }
    default:
      return state
  }
}

function updateTimelineForStatus(current: Order["timeline"], newStatus: OrderStatus): Order["timeline"] {
  const now = `${formatDate(new Date())}, ${formatTime(new Date())}`

  switch (newStatus) {
    case "Cancelled":
      return current.map((s) => ({ ...s, active: false, completed: false, upcoming: true }))
    case "Pending":
      return current.map((s, i) => ({
        ...s,
        completed: i === 0 ? true : false,
        active: i === 0 ? true : false,
        upcoming: i > 0,
      }))
    case "Assigned":
      return current.map((s, i) => ({
        ...s,
        completed: i === 0,
        active: i === 1,
        upcoming: i > 1,
        time: i === 1 ? now : s.time,
        description: i === 1 ? "Rider assigned and en route to pickup." : s.description,
      }))
    case "In-Transit":
      return current.map((s, i) => ({
        ...s,
        completed: i <= 1,
        active: i === 2,
        upcoming: i > 2,
        time: i === 2 ? now : s.time,
        description: i === 2 ? "Package in transit to destination." : s.description,
      }))
    case "Delivered":
      return current.map((s, i) => ({
        ...s,
        completed: i <= 2,
        active: i === 3,
        upcoming: false,
        time: i === 3 ? now : s.time,
        description: i === 3 ? "Delivered successfully. Signed for by recipient." : s.description,
      }))
    default:
      return current
  }
}

const OrderContext = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
  getOrder: (id: string) => Order | undefined
  filteredOrders: Order[]
} | null>(null)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, {
    orders: seedOrders,
    searchQuery: "",
  })

  const getOrder = useCallback(
    (id: string) => state.orders.find((o) => o.id === id),
    [state.orders]
  )

  const filteredOrders = state.searchQuery
    ? state.orders.filter(
        (o) =>
          o.id.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          o.customerName.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          o.location.toLowerCase().includes(state.searchQuery.toLowerCase())
      )
    : state.orders

  return (
    <OrderContext.Provider value={{ state, dispatch, getOrder, filteredOrders }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error("useOrders must be used within OrderProvider")
  return ctx
}
