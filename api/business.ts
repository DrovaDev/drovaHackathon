import { getSignupSetupTempToken } from "@/lib/setup-session";
import { apiClient } from "./client";
import {
	BusinessProfileEditPayload,
	BusinessProfileSetupPayload,
	GetBusinessLookupsResponse,
	GetBusinessStatesResponse,
	SetDeliveryPricingPayload,
	ValidateTINPayload,
} from "./types/business.types";
import { ApiResponse } from "./types/general.types";

export async function profileSetup(payload: BusinessProfileSetupPayload) {
	const tempToken = getSignupSetupTempToken();
	const response = await apiClient.post<ApiResponse>(
		"/business/profile/setup",
		payload,
		tempToken
			? { headers: { Authorization: `Bearer ${tempToken}` } }
			: undefined,
	);
	return response.data;
}

export async function profileEdit(payload: BusinessProfileEditPayload) {
	const response = await apiClient.post<ApiResponse>(
		"/business/profile/edit",
		payload,
	);
	return response.data;
}

export async function setDeliveryPricing(payload: SetDeliveryPricingPayload) {
	const response = await apiClient.post<ApiResponse>(
		"/business/delivery-pricing",
		payload,
	);
	return response.data;
}

export async function validateTIN(payload: ValidateTINPayload) {
	const response = await apiClient.post<ApiResponse>(
		"/business/validate-tin",
		payload,
	);
	return response.data;
}

export async function getBusinessStates() {
	const response =
		await apiClient.get<ApiResponse<GetBusinessStatesResponse[]>>(
			"/business/states",
		);
	return response.data;
}

export async function getBusinessLookups() {
	const response = await apiClient.get<ApiResponse<GetBusinessLookupsResponse>>(
		"/business/lookups",
	);
	return response.data;
}
