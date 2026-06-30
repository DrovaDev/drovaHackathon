import { OrderProvider } from "@/lib/order-context"

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return <OrderProvider>{children}</OrderProvider>
}
