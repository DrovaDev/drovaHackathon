import MaterialIcon from "@/components/ui/material-icon"

type Stat = {
  icon: string
  label: string
  value: string | number
  tag?: string
  iconBg: string
  iconColor: string
  highlighted?: boolean
}

type Props = {
  stats: Stat[]
}

export function OrderStatsGrid({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={
            stat.highlighted
              ? "bg-primary text-white rounded-xl p-6 border border-primary/20 hover:shadow-2xl hover:shadow-primary/10 transition-all relative overflow-hidden flex flex-col justify-between min-h-[160px]"
              : "bg-popover rounded-xl p-6 border border-border hover:shadow-2xl hover:shadow-primary/5 transition-all flex flex-col justify-between min-h-[160px]"
          }
        >
          {stat.highlighted && (
            <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
              <MaterialIcon name="trending_up" size={120} color="currentColor" />
            </div>
          )}
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                <MaterialIcon name={stat.icon} size={20} color={stat.iconColor} />
              </div>
              {stat.tag && (
                <span className={stat.highlighted ? "text-primary-fixed-dim text-[10px] font-bold tracking-wider uppercase" : "text-muted-foreground text-[10px] font-bold tracking-wider uppercase"}>
                  {stat.tag}
                </span>
              )}
            </div>
          </div>
          <div className="relative z-10 mt-auto">
            <h3 className={`text-2xl font-bold ${stat.highlighted ? "text-white" : "text-primary"}`}>
              {stat.value}
            </h3>
            <p className={`text-sm mt-1 ${stat.highlighted ? "text-white/70" : "text-muted-foreground"}`}>
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
