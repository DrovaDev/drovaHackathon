export interface LoginPayload {
	email?: string;
	telephoneNumber?: string;
	password: string;
	userType: string;
}

export interface Business {
	id: string;
	businessName: string;
	slug: string;
	isBusinessVerified: boolean;
}

export interface User {
	id: string;
	email: string;
	userType: string;
	hasCompletedBusinessProfile: boolean;
	business: Business;
}

export interface LoginResponse {
	accessToken: string;
	user: User;
}

export type RegisterPayload = LoginPayload;

export interface RegisterResponse {
	userId: string;
	email: string;
}

export interface ValidateEmailPayload {
	email: string;
	otp: string;
}

export interface ValidateEmailResponse {
	tempToken: string;
}

export interface ResendOTPPayload {
	email: string;
}

export type ResendOTPResponse = void;

export interface ForgotPasswordPayload {
	email: string;
}

export interface ValidateOTPPayload {
	tempToken: string;
	otp: string;
}

export interface ResetPasswordPayload {
	tempToken: string;
	newPassword: string;
	confirmPassword: string;
}

export interface ChangePasswordPayload {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}
