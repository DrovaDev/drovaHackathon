import { apiClient } from "./client";
import {
	CreateRiderProfilePayload,
	ResendRiderOtpPayload,
	RiderListItem,
	RiderListParams,
	RiderProfile,
	UpdateRiderAvailabilityPayload,
	UpdateRiderLocationPayload,
	UpdateRiderProfilePayload,
	ValidateRiderOtpPayload,
} from "./types/rider.types";
import { ApiResponse } from "./types/general.types";

export async function createRiderProfile(payload: CreateRiderProfilePayload) {
	const response = await apiClient.post<ApiResponse<RiderProfile>>(
		"/rider/profile",
		payload,
	);
	return response.data;
}

export async function getAllRiders(params?: RiderListParams) {
	const response = await apiClient.get<ApiResponse<RiderProfile[]>>(
		"/rider",
		{ params },
	);
	return response.data;
}

export async function getAssignableRiders(params?: RiderListParams) {
	const response = await apiClient.get<ApiResponse<RiderListItem[]>>(
		"/rider",
		{ params },
	);
	return response.data;
}

export async function getMyRiderProfile() {
	const response = await apiClient.get<ApiResponse<RiderProfile>>(
		"/rider/me",
	);
	return response.data;
}

export async function getRiderById(riderId: string) {
	const response = await apiClient.get<ApiResponse<RiderProfile>>(
		`/rider/${riderId}`,
	);
	return response.data;
}

export async function updateRiderProfile(payload: UpdateRiderProfilePayload) {
	const response = await apiClient.patch<ApiResponse<RiderProfile>>(
		"/rider",
		payload,
	);
	return response.data;
}

export async function deleteRider(riderId: string) {
	const response = await apiClient.delete<ApiResponse>(
		`/rider/${riderId}`,
	);
	return response.data;
}

export async function updateRiderAvailability(
	riderId: string,
	payload: UpdateRiderAvailabilityPayload,
) {
	const response = await apiClient.patch<ApiResponse<RiderProfile>>(
		`/rider/${riderId}/availability`,
		payload,
	);
	return response.data;
}

export async function updateRiderLocation(
	riderId: string,
	payload: UpdateRiderLocationPayload,
) {
	const response = await apiClient.patch<ApiResponse>(
		`/rider/${riderId}/location`,
		payload,
	);
	return response.data;
}

export async function resendRiderOtp(payload: ResendRiderOtpPayload) {
	const response = await apiClient.post<ApiResponse>(
		"/rider/resend-otp",
		payload,
	);
	return response.data;
}

export async function validateRiderOtp(payload: ValidateRiderOtpPayload) {
	const response = await apiClient.post<ApiResponse>(
		"/rider/validate-otp",
		payload,
	);
	return response.data;
}
