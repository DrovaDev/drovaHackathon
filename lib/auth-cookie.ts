export const ACCESS_TOKEN_COOKIE_NAME = "access_token";

const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;

function canUseDocument() {
	return typeof document !== "undefined";
}

function canUseLocalStorage() {
	return typeof window !== "undefined" && "localStorage" in window;
}

export function getAccessTokenCookie() {
	if (!canUseDocument()) {
		return null;
	}

	const cookies = document.cookie ? document.cookie.split("; ") : [];

	for (const cookie of cookies) {
		const [name, ...valueParts] = cookie.split("=");

		if (name === ACCESS_TOKEN_COOKIE_NAME) {
			return decodeURIComponent(valueParts.join("="));
		}
	}

	return null;
}

function getLegacyAccessToken() {
	if (!canUseLocalStorage()) {
		return null;
	}

	return window.localStorage.getItem("token");
}

export function setAccessTokenCookie(
	token: string,
	options?: { persistent?: boolean },
) {
	if (!canUseDocument()) {
		return;
	}

	const parts = [
		`${ACCESS_TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}`,
		"path=/",
		"SameSite=Lax",
	];

	if (typeof window !== "undefined" && window.location.protocol === "https:") {
		parts.push("Secure");
	}

	if (options?.persistent) {
		parts.push(`max-age=${THIRTY_DAYS_IN_SECONDS}`);
	}

	document.cookie = parts.join("; ");
}

export function getStoredAccessToken() {
	const cookieToken = getAccessTokenCookie();

	if (cookieToken) {
		return cookieToken;
	}

	const legacyToken = getLegacyAccessToken();

	if (legacyToken) {
		setAccessTokenCookie(legacyToken);
		window.localStorage.removeItem("token");
		return legacyToken;
	}

	return null;
}

export function clearAccessTokenCookie() {
	if (!canUseDocument()) {
		return;
	}

	document.cookie = `${ACCESS_TOKEN_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;

	if (canUseLocalStorage()) {
		window.localStorage.removeItem("token");
	}
}
