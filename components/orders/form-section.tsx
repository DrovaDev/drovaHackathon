import type { ReactNode } from "react"
import MaterialIcon from "@/components/ui/material-icon"

type Props = {
  title: string
  icon: string
  children: ReactNode
}

export function FormSection({ title, icon, children }: Props) {
  return (
    <div className="bg-popover rounded-xl p-8 border border-border space-y-8">
      <h3 className="font-bold text-lg text-primary flex items-center gap-2">
        <MaterialIcon name={icon} size={20} color="var(--primary)" />
        {title}
      </h3>
      {children}
    </div>
  )
}
