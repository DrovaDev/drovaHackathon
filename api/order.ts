import { apiClient } from "./client";
import { ApiResponse } from "./types/general.types";
import {
	GetOrdersParams,
	GetQuotationsParams,
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
