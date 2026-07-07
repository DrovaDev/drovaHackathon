"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import MaterialIcon from "@/components/ui/material-icon";
import { Pagination } from "@/components/riders/pagination";
import { NotificationItem } from "@/components/notifications";
import { notification } from "@/services/router";
import type { Notification as NotificationRecord } from "@/services/types/notification.types";

const PAGE_SIZE = 20;

export default function NotificationsPage() {
	const [page, setPage] = useState(1);
	const [unreadOnly, setUnreadOnly] = useState(false);
	const router = useRouter();
	const queryClient = useQueryClient();

	const { data, isLoading, isError } = notification.inbox.useQuery({
		variables: { page, limit: PAGE_SIZE, unreadOnly },
	});
	const { data: unreadData } = notification.unreadCount.useQuery();

	const notifications = data?.data ?? [];
	const meta = data?.meta;
	const unreadCount = unreadData?.data?.count ?? 0;

	const invalidateNotifications = () =>
		queryClient.invalidateQueries({ queryKey: ["notification"] });

	const markOneReadMutation = notification.markOneRead.useMutation({
		onSuccess: invalidateNotifications,
	});

	const markAllReadMutation = notification.markAllRead.useMutation({
		onSuccess: () => {
			invalidateNotifications();
			toast.success("All notifications marked as read");
		},
		onError: (error) =>
			toast.error(
				(error as AxiosError<{ message: string }>).response?.data
					?.message || "Failed to mark notifications as read",
			),
	});

	const handleOpen = (n: NotificationRecord) => {
		if (!n.isRead) {
			markOneReadMutation.mutate({ id: n.id });
		}
		if (n.data?.orderId) {
			router.push(`/dashboard/orders/${n.data.orderId}`);
		}
	};

	const handleMarkRead = (n: NotificationRecord) => {
		markOneReadMutation.mutate({ id: n.id });
	};

	return (
		<div className="px-6 lg:px-10 py-8 space-y-6">
			{/* Header */}
			<div className="flex items-start justify-between gap-4 flex-wrap">
				<div>
					<h1 className="text-2xl font-extrabold text-primary tracking-tight">
						Notifications
					</h1>
					<p className="text-muted-foreground text-sm mt-0.5">
						Stay up to date with orders and deliveries
					</p>
				</div>
				{unreadCount > 0 && (
					<Button
						variant="ghost"
						onClick={() => markAllReadMutation.mutate()}
						disabled={markAllReadMutation.isPending}
					>
						<MaterialIcon
							name="done_all"
							size={16}
							color="var(--primary)"
						/>
						Mark all as read
					</Button>
				)}
			</div>

			{/* Filter tabs */}
			<div className="border-b border-border flex gap-0">
				<button
					onClick={() => {
						setUnreadOnly(false);
						setPage(1);
					}}
					className={`px-5 py-3 text-sm font-bold transition-colors border-b-2 ${
						!unreadOnly
							? "text-primary border-primary"
							: "text-muted-foreground border-transparent hover:text-foreground"
					}`}
				>
					All
				</button>
				<button
					onClick={() => {
						setUnreadOnly(true);
						setPage(1);
					}}
					className={`relative px-5 py-3 text-sm font-bold transition-colors border-b-2 ${
						unreadOnly
							? "text-primary border-primary"
							: "text-muted-foreground border-transparent hover:text-foreground"
					}`}
				>
					Unread
					{unreadCount > 0 && (
						<span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-black">
							{unreadCount}
						</span>
					)}
				</button>
			</div>

			{/* List */}
			<div className="bg-popover rounded-2xl border border-border overflow-hidden">
				<div className="divide-y divide-border">
					{isLoading && (
						<div className="text-center py-12 text-muted-foreground text-sm">
							Loading notifications...
						</div>
					)}
					{isError && (
						<div className="text-center py-12 text-destructive text-sm">
							Failed to load notifications.
						</div>
					)}
					{!isLoading && !isError && notifications.length === 0 && (
						<div className="text-center py-12 text-muted-foreground text-sm">
							{unreadOnly
								? "No unread notifications"
								: "No notifications yet"}
						</div>
					)}
					{!isLoading &&
						!isError &&
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
							/>
						))}
				</div>
				{meta && meta.totalPages && meta.totalPages > 1 && (
					<div className="px-6 py-4 border-t border-border flex items-center justify-between">
						<p className="text-xs text-muted-foreground">
							Page{" "}
							<span className="font-bold text-foreground">
								{meta.currentPage ?? page}
							</span>{" "}
							of{" "}
							<span className="font-bold text-foreground">
								{meta.totalPages}
							</span>
						</p>
						<Pagination
							currentPage={meta.currentPage ?? page}
							totalPages={meta.totalPages}
							onPageChange={setPage}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
