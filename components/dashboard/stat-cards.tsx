import MaterialIcon from "@/components/ui/material-icon"

export interface StatCard {
	icon: string
	label: string
	value: string | number
	sub: string
	iconBg: string
	iconColor: string
	badge?: string
	badgeColor?: string
	highlighted?: boolean
}

type Props = {
	stats: StatCard[]
}

export function StatCards({ stats }: Props) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
			{stats.map((s) => (
				<div
					key={s.label}
					className={`rounded-2xl p-5 border border-border flex flex-col gap-3 ${s.highlighted ? "bg-primary text-primary-foreground" : "bg-popover"}`}
				>
					<div className="flex items-start justify-between">
						<div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconBg}`}>
							<MaterialIcon name={s.icon} size={20} color={s.iconColor} />
						</div>
						{s.badge && (
							<span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${s.badgeColor}`}>
								{s.badge}
							</span>
						)}
					</div>
					<div>
						<div className={`text-3xl font-extrabold tracking-tight ${s.highlighted ? "text-white" : "text-primary"}`}>
							{s.value}
						</div>
						<div className={`text-sm font-semibold mt-0.5 ${s.highlighted ? "text-white/80" : "text-foreground"}`}>
							{s.label}
						</div>
						<div className={`text-xs mt-0.5 ${s.highlighted ? "text-white/60" : "text-muted-foreground"}`}>
							{s.sub}
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
