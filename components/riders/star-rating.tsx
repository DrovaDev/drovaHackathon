import MaterialIcon from "@/components/ui/material-icon"

type Props = { rating: number }

export function StarRating({ rating }: Props) {
	return (
		<div className="flex items-center gap-0.5">
			{[1, 2, 3, 4, 5].map(i => (
				<MaterialIcon
					key={i}
					name="star"
					size={12}
					color={i <= Math.round(rating ?? 0) ? "#D97706" : "var(--border)"}
				/>
			))}
			<span className="text-xs text-muted-foreground ml-1">{rating ?? 0}</span>
		</div>
	)
}
