import { apiClient } from "./client";
import {
    ChangePasswordPayload,
	ForgotPasswordPayload,
	LoginPayload,
	LoginResponse,
	RegisterPayload,
	RegisterResponse,
	ResendOTPPayload,
	ResendOTPResponse,
	ResetPasswordPayload,
	ValidateEmailPayload,
	ValidateEmailResponse,
    ValidateOTPPayload,
} from "./types/auth.types";
import { ApiResponse } from "./types/general.types";

export async function login(payload: LoginPayload) {
	const response = await apiClient.post<ApiResponse<LoginResponse>>(
		"/authentication/login",
		payload,
	);
	return response.data;
}

// signup register
export async function register(payload: RegisterPayload) {
	const response = await apiClient.post<ApiResponse<RegisterResponse>>(
		"/authentication/register",
		payload,
	);
	return response.data;
}

// validate email
export async function validateEmail(payload: ValidateEmailPayload) {
	const response = await apiClient.post<ApiResponse<ValidateEmailResponse>>(
		"/authentication/validate-email",
		payload,
	);
	return response.data;
}

// resendOTP
export async function resendOTP(payload: ResendOTPPayload) {
	const response = await apiClient.post<ApiResponse<ResendOTPResponse>>(
		"/authentication/resend-otp",
		payload,
	);
	return response.data;
}

// forgot password
export async function forgotPassword(payload: ForgotPasswordPayload) {
	const response = await apiClient.post<ApiResponse>(
		"/authentication/forgot-password",
		payload,
	);
	return response.data;
}

// validate otp 
export async function validateOTP(payload: ValidateOTPPayload) {
    const response = await apiClient.post<ApiResponse<ValidateEmailResponse>>(
        "/authentication/validate-otp",
        payload
    );
    return response.data;
}


// reset password
export async function resetPassword(payload: ResetPasswordPayload) {
    const response = await apiClient.post<ApiResponse>(
        "/authentication/reset-password",
        payload
    );
    return response.data;
}

// export async function validateRiderLoginOTP(payload){
//     const response = await
// }

export async function changePassword(payload:ChangePasswordPayload){
    const response = await apiClient.post<ApiResponse>(
        "/authentication/change-password",
        payload
    );
    return response.data;
}