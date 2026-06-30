import MaterialIcon from "@/components/ui/material-icon"

type Props = {
  name: string
  phone: string
  email: string
}

export function CustomerInfoCard({ name, phone, email }: Props) {
  return (
    <div className="bg-popover rounded-xl p-8 border border-border hover:shadow-2xl hover:shadow-primary/5 transition-all space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-primary">Customer Information</h3>
        <MaterialIcon name="person" size={20} color="var(--muted-foreground)" />
      </div>
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
          <MaterialIcon name="account_circle" size={24} color="var(--primary)" isFilled />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-foreground text-lg">{name}</p>
          <p className="text-muted-foreground font-medium text-sm">{phone}</p>
          <p className="text-muted-foreground text-xs truncate">{email}</p>
        </div>
      </div>
    </div>
  )
}
