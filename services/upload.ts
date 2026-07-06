import { ApiResponse } from "./types/general.types";
import axios from "axios";

export interface UploadPayload {
	file: File;
	onProgress?: (percent: number) => void;
}

export async function uploadLogo({
	file,
	onProgress,
}: UploadPayload): Promise<ApiResponse<{ url: string }>> {
	const form = new FormData();
	form.append("file", file);
	const response = await axios.post<ApiResponse<{ url: string }>>(
		"/api/upload/logo",
		form,
		{
			onUploadProgress: (e) => {
				if (e.total) onProgress?.(Math.round((e.loaded / e.total) * 100));
			},
		},
	);
	return response.data;
}

export async function uploadCover({
	file,
	onProgress,
}: UploadPayload): Promise<ApiResponse<{ url: string }>> {
	const form = new FormData();
	form.append("file", file);
	const response = await axios.post<ApiResponse<{ url: string }>>(
		"/api/upload/cover",
		form,
		{
			onUploadProgress: (e) => {
				if (e.total) onProgress?.(Math.round((e.loaded / e.total) * 100));
			},
		},
	);
	return response.data;
}
