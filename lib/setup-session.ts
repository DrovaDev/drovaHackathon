const SIGNUP_SETUP_EMAIL_KEY = "signup-setup-email";
const SIGNUP_SETUP_TEMP_TOKEN_KEY = "signup-setup-temp-token";

function canUseSessionStorage() {
	return typeof window !== "undefined" && "sessionStorage" in window;
}

export function storeSignupSetupEmail(email: string) {
	if (!canUseSessionStorage()) {
		return;
	}

	window.sessionStorage.setItem(SIGNUP_SETUP_EMAIL_KEY, email);
}

export function getSignupSetupEmail() {
	if (!canUseSessionStorage()) {
		return null;
	}

	return window.sessionStorage.getItem(SIGNUP_SETUP_EMAIL_KEY);
}

export function clearSignupSetupEmail() {
	if (!canUseSessionStorage()) {
		return;
	}

	window.sessionStorage.removeItem(SIGNUP_SETUP_EMAIL_KEY);
}

export function storeSignupSetupTempToken(tempToken: string) {
	if (!canUseSessionStorage()) {
		return;
	}

	window.sessionStorage.setItem(SIGNUP_SETUP_TEMP_TOKEN_KEY, tempToken);
}

export function getSignupSetupTempToken() {
	if (!canUseSessionStorage()) {
		return null;
	}

	return window.sessionStorage.getItem(SIGNUP_SETUP_TEMP_TOKEN_KEY);
}

export function clearSignupSetupTempToken() {
	if (!canUseSessionStorage()) {
		return;
	}

	window.sessionStorage.removeItem(SIGNUP_SETUP_TEMP_TOKEN_KEY);
}
