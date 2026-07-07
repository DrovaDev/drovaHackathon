import { apiClient } from "./client";
import { ApiResponse } from "./types/general.types";
import {
	CreateDirectOrderPayload,
	CreateInvoicePayload,
	CreateQuotationPayload,
	GetOrdersParams,
	GetQuotationsParams,
	ManuallyAssignOrderPayload,
	Order,
	OrderDetail,
} from "./types/order.types";

export async function getOrders(params: GetOrdersParams) {
	const response = await apiClient.get<ApiResponse<Order[]>>("/order", {
		params,
	});
	return response.data;
}

export async function getQuotations(params: GetQuotationsParams) {
	const response = await apiClient.get<ApiResponse<Order[]>>("/order", {
		params: { ...params, status: "quotation" },
	});
	return response.data;
}

export async function getOrder(id: string) {
	const response = await apiClient.get<ApiResponse<OrderDetail>>(
		`/order/${id}`,
	);
	return response.data;
}

export async function createInvoice(
	orderId: string,
	payload: CreateInvoicePayload,
) {
	const response = await apiClient.post<ApiResponse<OrderDetail>>(
		`/order/${orderId}/invoice`,
		payload,
	);
	return response.data;
}

export async function resendInvoice(orderId: string) {
	const response = await apiClient.post<ApiResponse<OrderDetail>>(
		`/order/${orderId}/resend-invoice`,
	);
	return response.data;
}

export async function manuallyAssignOrder(payload: ManuallyAssignOrderPayload) {
	const response = await apiClient.post<ApiResponse>(
		"/order/assign",
		payload,
	);
	return response.data;
}

export async function createDirectOrder(payload: CreateDirectOrderPayload) {
	const response = await apiClient.post<ApiResponse<OrderDetail>>(
		"/order/direct",
		payload,
	);
	return response.data;
}

export async function createQuotation(payload: CreateQuotationPayload) {
	const response = await apiClient.post<ApiResponse<OrderDetail>>(
		"/order/create",
		payload,
	);
	return response.data;
}