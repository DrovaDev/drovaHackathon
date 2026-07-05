import { useSyncExternalStore } from "react";

const USER_SESSION_KEY = "user_session";

export interface StoredUserSession {
	businessName: string;
	email: string;
}

function canUseLocalStorage() {
	return typeof window !== "undefined" && "localStorage" in window;
}

export function storeUserSession(session: StoredUserSession) {
	if (!canUseLocalStorage()) {
		return;
	}

	window.localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
}

export function clearUserSession() {
	if (!canUseLocalStorage()) {
		return;
	}

	window.localStorage.removeItem(USER_SESSION_KEY);
}

let cachedRaw: string | null = null;
let cachedSession: StoredUserSession | null = null;

function readUserSessionSnapshot(): StoredUserSession | null {
	if (!canUseLocalStorage()) {
		return null;
	}

	const raw = window.localStorage.getItem(USER_SESSION_KEY);

	if (raw !== cachedRaw) {
		cachedRaw = raw;
		try {
			cachedSession = raw ? (JSON.parse(raw) as StoredUserSession) : null;
		} catch {
			cachedSession = null;
		}
	}

	return cachedSession;
}

function getServerUserSessionSnapshot(): StoredUserSession | null {
	return null;
}

function subscribeToUserSession(callback: () => void) {
	window.addEventListener("storage", callback);
	return () => window.removeEventListener("storage", callback);
}

export function useUserSession() {
	return useSyncExternalStore(
		subscribeToUserSession,
		readUserSessionSnapshot,
		getServerUserSessionSnapshot,
	);
}
