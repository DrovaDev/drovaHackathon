export type RiderAvailabilityStatus = "available" | "on_trip" | "offline"

export type RiderInviteStatus = "pending" | "accepted" | "rejected"

export type RiderStatus = "pending" | "active" | "suspended" | "inactive"

export type RiderVehicleType = "bike" | "car" | "van" | "truck" | "bicycle"

export interface CreateRiderProfilePayload {
	telephoneNumber: string
	firstName: string
	lastName: string
	otherName?: string
	profilePhoto?: string
	vehicleType: RiderVehicleType
	vehiclePlateNumber?: string
	vehicleModel?: string
	vehicleColor?: string
}

export interface UpdateRiderProfilePayload {
	telephoneNumber?: string
	firstName?: string
	lastName?: string
	otherName?: string
	profilePhoto?: string
	vehicleType?: RiderVehicleType
	vehiclePlateNumber?: string
	vehicleModel?: string
	vehicleColor?: string
}

export interface UpdateRiderAvailabilityPayload {
	availabilityStatus: RiderAvailabilityStatus
}

export interface UpdateRiderLocationPayload {
	latitude: number
	longitude: number
}

export interface ResendRiderOtpPayload {
	telephoneNumber: string
}

export interface ValidateRiderOtpPayload {
	telephoneNumber: string
	otp: string
}

export interface RiderProfile {
	id: string
	authId: string
	firstName: string
	lastName: string
	otherName?: string
	email?: string
	telephoneNumber: string
	profilePhoto?: string
	vehicleType: RiderVehicleType
	vehiclePlateNumber?: string
	vehicleModel?: string
	vehicleColor?: string
	availabilityStatus: RiderAvailabilityStatus
	inviteStatus: RiderInviteStatus
	status: RiderStatus
	totalDeliveries: number
	completionRate: number
	rating: number
	pendingEarnings: number
	bankAccountNumber?: string
	bankCode?: string
	bankName?: string
	currentLocation?: {
		latitude: number
		longitude: number
	}
	createdAt: string
	updatedAt: string
}

export interface RiderListParams {
	page?: number
	limit?: number
	sortBy?: string
	sortOrder?: "asc" | "desc"
	search?: string
	availabilityStatus?: RiderAvailabilityStatus
	inviteStatus?: RiderInviteStatus
	status?: RiderStatus
	startDate?: string
	endDate?: string
}

export interface RiderAuthSummary {
	id: string
	email: string | null
	telephoneNumber: string
	userType: string
	isActive: boolean
	isVerified: boolean
	isSuspended: boolean
	isDeleted: boolean
	hasCompletedBusinessProfile: boolean | null
	createdAt: string
	updatedAt: string
}

export interface RiderListItem {
	id: string
	authId: string
	businessId: string
	firstName: string | null
	lastName: string | null
	otherName: string | null
	phoneNumber: string
	profilePhoto: string | null
	vehicleType: RiderVehicleType | null
	vehiclePlateNumber: string | null
	vehicleModel: string | null
	vehicleColor: string | null
	status: RiderStatus
	isDeleted: boolean
	hasChangedPassword: boolean
	inviteStatus: RiderInviteStatus
	availabilityStatus: RiderAvailabilityStatus
	lastKnownLocation: { type: "Point"; coordinates: [number, number] } | null
	lastLocationUpdatedAt: string | null
	activeDeviceId: string | null
	sessionId: string | null
	auth: RiderAuthSummary
	createdAt: string
	updatedAt: string
}
