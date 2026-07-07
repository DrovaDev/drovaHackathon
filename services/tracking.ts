import axios from "axios"
import { OrderTrackingData } from "./types/tracking.types"
import { ApiResponse } from "./types/general.types"

const publicClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	timeout: 15000,
})

export async function trackOrder(referenceCode: string) {
	const response = await publicClient.get<ApiResponse<OrderTrackingData>>(
		`/order/track/${referenceCode}`,
	)
	return response.data
}
