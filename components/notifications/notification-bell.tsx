"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { Notifications } from "@mui/icons-material"
import { muiOpts } from "@/lib/utils"
import { useClickOutside } from "@/hooks/use-click-outside"
import { notification } from "@/services/router"
import type { Notification as NotificationRecord } from "@/services/types/notification.types"
import { NotificationItem } from "./notification-item"

const UNREAD_COUNT_POLL_MS = 30000
const PREVIEW_LIMIT = 6

export function NotificationBell() {
	const [open, setOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const router = useRouter()
	const queryClient = useQueryClient()

	useClickOutside(containerRef, () => setOpen(false))

	const { data: unreadData } = notification.unreadCount.useQuery({
		refetchInterval: UNREAD_COUNT_POLL_MS,
	})
	const unreadCount = unreadData?.data?.count ?? 0

	const { data: inboxData, isLoading } = notification.inbox.useQuery({
		variables: { page: 1, limit: PREVIEW_LIMIT },
		enabled: open,
	})
	const notifications = inboxData?.data ?? []

	const invalidateNotifications = () =>
		queryClient.invalidateQueries({ queryKey: ["notification"] })

	const markOneReadMutation = notification.markOneRead.useMutation({
		onSuccess: invalidateNotifications,
	})
	const markAllReadMutation = notification.markAllRead.useMutation({
		onSuccess: invalidateNotifications,
	})

	const handleOpen = (n: NotificationRecord) => {
		if (!n.isRead) {
			markOneReadMutation.mutate({ id: n.id })
		}
		setOpen(false)
		if (n.data?.orderId) {
			router.push(`/dashboard/orders/${n.data.orderId}`)
		}
	}

	const handleMarkRead = (n: NotificationRecord) => {
		markOneReadMutation.mutate({ id: n.id })
	}

	return (
		<div ref={containerRef} className="relative">
			<button
				onClick={() => setOpen((prev) => !prev)}
				className="relative cursor-pointer hover:opacity-50 transition duration-300 ease-in"
			>
				{unreadCount > 0 && (
					<span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-destructive text-white text-[10px] font-bold leading-none flex items-center justify-center z-10">
						{unreadCount > 9 ? "9+" : unreadCount}
					</span>
				)}
				<Notifications sx={muiOpts("var(--muted-foreground)")} />
			</button>

			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, y: -8, scale: 0.98 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -8, scale: 0.98 }}
						transition={{ duration: 0.15, ease: "easeOut" }}
						className="absolute right-0 mt-3 w-80 sm:w-96 bg-popover rounded-2xl border border-border shadow-2xl overflow-hidden z-50"
					>
						<div className="flex items-center justify-between px-4 py-3 border-b border-border">
							<h3 className="text-sm font-bold text-foreground">
								Notifications
							</h3>
							{unreadCount > 0 && (
								<button
									onClick={() => markAllReadMutation.mutate()}
									disabled={markAllReadMutation.isPending}
									className="text-xs font-bold text-secondary hover:underline disabled:opacity-50"
								>
									Mark all as read
								</button>
							)}
						</div>

						<div className="max-h-96 overflow-y-auto divide-y divide-border">
							{isLoading && (
								<div className="px-4 py-8 text-center text-xs text-muted-foreground">
									Loading notifications...
								</div>
							)}
							{!isLoading && notifications.length === 0 && (
								<div className="px-4 py-8 text-center text-xs text-muted-foreground">
									You&apos;re all caught up
								</div>
							)}
							{!isLoading &&
								notifications.map((n) => (
									<NotificationItem
										key={n.id}
										notification={n}
										onOpen={handleOpen}
										onMarkRead={handleMarkRead}
										isMarkingRead={
											markOneReadMutation.isPending &&
											markOneReadMutation.variables?.id === n.id
										}
										dense
									/>
								))}
						</div>

						<Link
							href="/dashboard/notifications"
							onClick={() => setOpen(false)}
							className="block text-center text-xs font-bold text-primary py-3 border-t border-border hover:bg-muted/30 transition-colors"
						>
							See all notifications
						</Link>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
