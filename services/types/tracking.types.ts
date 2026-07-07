export interface TrackingTimelineEvent {
	event: string
	label: string
	timestamp: string
}

export interface TrackingPickup {
	address: string
	city?: string
	state?: string
}

export interface TrackingDelivery {
	address: string
}

export interface TrackingBusiness {
	name: string
}

export interface OrderTrackingData {
	referenceCode: string
	status: string
	business: TrackingBusiness
	pickup: TrackingPickup
	delivery: TrackingDelivery
	cancellationReason: string | null
	timeline: TrackingTimelineEvent[]
}
