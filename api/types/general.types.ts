export interface ApiResponse<T = unknown> {
	status: "success" | "fail";
	statusCode: number;
	message: string;
	data?: T;
	error?: unknown;
	meta?: {
		count?: number;
		totalPages?: number;
		currentPage?: number;
		limit?: number;
	};
}
