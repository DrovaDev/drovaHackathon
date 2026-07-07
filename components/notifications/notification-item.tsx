import { Button } from "@/components/ui/button"
import MaterialIcon from "@/components/ui/material-icon"
import { getNotificationTypeConfig, formatNotificationTime } from "@/lib/notification-type"
import type { Notification } from "@/services/types/notification.types"

type Props = {
	notification: Notification
	onOpen: (notification: Notification) => void
	onMarkRead: (notification: Notification) => void
	dense?: boolean
	isMarkingRead?: boolean
}

export function NotificationItem({
	notification,
	onOpen,
	onMarkRead,
	dense,
	isMarkingRead,
}: Props) {
	const cfg = getNotificationTypeConfig(notification.type)

	return (
		<div
			className={`w-full flex items-start gap-2 transition-colors hover:bg-muted/30 ${
				dense ? "px-4 py-3" : "px-5 py-4"
			} ${!notification.isRead ? "bg-primary/5" : ""}`}
		>
			<button
				onClick={() => onOpen(notification)}
				className="flex items-start gap-3 flex-1 min-w-0 text-left"
			>
				<div
					className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.iconBg}`}
				>
					<MaterialIcon name={cfg.icon} size={18} color={cfg.iconColor} />
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<p className="text-sm font-bold text-foreground truncate">
							{notification.title}
						</p>
						{!notification.isRead && (
							<span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
						)}
					</div>
					<p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
						{notification.body}
					</p>
					<p className="text-[10px] text-muted-foreground/70 mt-1 font-medium">
						{formatNotificationTime(notification.createdAt)}
					</p>
				</div>
			</button>

			{!notification.isRead && (
				<Button
					size="icon-sm"
					variant="ghost"
					title="Mark as read"
					disabled={isMarkingRead}
					onClick={(e) => {
						e.stopPropagation()
						onMarkRead(notification)
					}}
					className="shrink-0 mt-0.5"
				>
					<MaterialIcon name="done" size={16} color="var(--muted-foreground)" />
				</Button>
			)}
		</div>
	)
}
