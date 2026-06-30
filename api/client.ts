import axios from "axios";
import { getStoredAccessToken } from "@/lib/auth-cookie";

export const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
	const token = getStoredAccessToken();

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});
