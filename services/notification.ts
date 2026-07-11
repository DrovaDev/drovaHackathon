import { apiClient } from "./client";
import { ApiResponse } from "./types/general.types";
import {
	GetNotificationsParams,
	MarkAllReadResult,
	MarkOneReadResult,
	Notification,
	UnreadCount,
} from "./types/notification.types";

export async function getInbox(params?: GetNotificationsParams) {
	const response = await apiClient.get<ApiResponse<Notification[]>>(
		"/notification/inbox",
		{ params },
	);
	return response.data;
}

export async function getUnreadCount() {
	const response = await apiClient.get<ApiResponse<UnreadCount>>(
		"/notification/inbox/unread-count",
	);
	return response.data;
}

export async function markAllRead() {
	const response = await apiClient.patch<ApiResponse<MarkAllReadResult>>(
		"/notification/inbox/read-all",
	);
	return response.data;
}

export async function markOneRead(id: string) {
	const response = await apiClient.patch<ApiResponse<MarkOneReadResult>>(
		`/notification/inbox/${id}/read`,
	);
	return response.data;
}
