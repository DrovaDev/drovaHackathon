"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const tabs = [
  { label: "Overview", slug: "storefront" },
  { label: "Identity & Branding", slug: "storefront/branding" },
  { label: "Operations", slug: "storefront/operations" },
]

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const getActiveSlug = () => {
    if (pathname === "/dashboard/storefront") return "storefront"
    if (pathname.includes("/branding")) return "storefront/branding"
    if (pathname.includes("/operations")) return "storefront/operations"
    return "storefront"
  }

  const activeSlug = getActiveSlug()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="border-b border-border bg-popover flex gap-0 px-6 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeSlug === tab.slug
          return (
            <Link
              key={tab.slug}
              href={`/dashboard/${tab.slug}`}
              className={cn(
                "relative px-4 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors whitespace-nowrap border-b-2",
                isActive
                  ? "text-secondary border-secondary"
                  : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/30"
              )}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="storefrontActiveTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          )
        })}
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}
