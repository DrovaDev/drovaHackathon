import { Button } from "@/components/ui/button"
import MaterialIcon from "@/components/ui/material-icon"

type Props = {
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: Props) {
	if (totalPages <= 1) return null

	return (
		<div className="flex items-center justify-center gap-2">
			<Button
				variant="ghost"
				size="sm"
				disabled={currentPage <= 1}
				onClick={() => onPageChange(currentPage - 1)}
			>
				<MaterialIcon name="chevron_left" size={16} color="currentColor" />
			</Button>
			<div className="flex items-center gap-1">
				{Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
					<button
						key={page}
						onClick={() => onPageChange(page)}
						className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
							page === currentPage
								? "bg-primary text-white"
								: "text-muted-foreground hover:bg-muted"
						}`}
					>
						{page}
					</button>
				))}
			</div>
			<Button
				variant="ghost"
				size="sm"
				disabled={currentPage >= totalPages}
				onClick={() => onPageChange(currentPage + 1)}
			>
				<MaterialIcon name="chevron_right" size={16} color="currentColor" />
			</Button>
		</div>
	)
}
