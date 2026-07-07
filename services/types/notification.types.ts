export type NotificationType =
	| "NEW_ORDER"
	| "ORDER_OFFER_EXPIRED"
	| (string & {});

export interface NotificationData {
	orderId?: string;
	referenceCode?: string;
	[key: string]: unknown;
}

export interface Notification {
	id: string;
	authId: string;
	type: NotificationType;
	title: string;
	body: string;
	data: NotificationData | null;
	isRead: boolean;
	createdAt: string;
}

export interface GetNotificationsParams {
	page?: number;
	limit?: number;
	unreadOnly?: boolean;
}

export interface UnreadCount {
	count: number;
}

export interface MarkAllReadResult {
	updated: number;
}

export interface MarkOneReadResult {
	updated: boolean;
}
