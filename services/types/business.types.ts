export type BusinessLocationType = "Point";

export interface BusinessLocationPayload {
	type: BusinessLocationType;
	coordinates: [longitude: number, latitude: number];
}

export type DeliveryScope = "intracity" | "intercity" | "interstate";

export type DeliveryServiceType =
	| "standard"
	| "express"
	| "scheduled"
	| "same_day";

export type VehicleType = "bike" | "bicycle" | "car" | "van" | "truck";

export type PackageType =
	| "parcel"
	| "document"
	| "food"
	| "groceries"
	| "fragile"
	| "bulk";

export type OperatingDay =
	| "monday"
	| "tuesday"
	| "wednesday"
	| "thursday"
	| "friday"
	| "saturday"
	| "sunday";

export type OperatingStatus = "open" | "closed";

export interface BusinessOperatingHourPayload {
	day: OperatingDay;
	opensAt: string;
	closesAt: string;
	status: OperatingStatus;
}

export interface BusinessProfileSetupPayload {
	businessName: string;
	businessDescription: string;
	businessAddress: string;
	businessState: string;
	location: BusinessLocationPayload;
	deliveryScope: DeliveryScope[];
	fleetSize: number;
	businessRegistrationNumber: string;
	taxIdentificationNumber: string;
	bvn: string;
	contactNumber: string;
	businessLogo: string;
	coverImage: string;
	operatingHours: BusinessOperatingHourPayload[];
}

export type BusinessProfileEditPayload = BusinessProfileSetupPayload;

export interface BusinessProfileResponse {
	id: string;
	authId: string;
	isVerified: boolean;
	businessName: string;
	businessDescription: string;
	businessAddress: string;
	businessState: string;
	location: BusinessLocationPayload;
	deliveryScope: DeliveryScope[];
	fleetSize: number;
	businessRegistrationNumber: string;
	taxIdentificationNumber: string;
	bvn: string;
	contactNumber: string;
	businessLogo: string;
	coverImage: string;
	slug: string;
	operatingHours: BusinessOperatingHourPayload[];
	createdAt: string;
	updatedAt: string;
}

export type DeliveryPricingUnit = "km";

export interface IntracityDeliveryPricingBracketPayload {
	minDistance: number;
	maxDistance: number;
	cost: number;
}

export interface IntracityDeliveryPricingPayload {
	unit: DeliveryPricingUnit;
	brackets: IntracityDeliveryPricingBracketPayload[];
}

export interface InterstateDeliveryPricingPayload {
	state: string;
	cost: number;
}

export interface SetDeliveryPricingPayload {
	intracityDeliveryPricing: IntracityDeliveryPricingPayload;
	interstateDeliveryPricing: InterstateDeliveryPricingPayload[];
}

export interface ValidateTINPayload {
	businessRegistrationNumber: string;
	businessName: string;
	taxIdentificationNumber: string;
}

interface KeyValuePair {
    key: string;
    value: string;
}

export type GetBusinessStatesResponse = KeyValuePair 

export interface GetBusinessLookupsResponse {
	states: KeyValuePair[];
	deliveryScope: KeyValuePair[];
	deliveryServiceType: KeyValuePair[];
	vehicleType: KeyValuePair[];
	packageTypes: KeyValuePair[];
	subscriptionPlans: KeyValuePair[];
    businessDaysOfWeek: KeyValuePair[];
    businessOperatingStatus: KeyValuePair[];
}

export interface StorefrontBusinessProfile {
	id: string;
	authId: string;
	isVerified: boolean;
	businessName: string;
	businessDescription: string;
	businessAddress: string;
	businessState: string;
	location: BusinessLocationPayload;
	deliveryScope: DeliveryScope[];
	fleetSize: number;
	businessRegistrationNumber: string;
	contactNumber: string;
	businessLogo: string;
	coverImage: string;
	slug: string;
	operatingHours: BusinessOperatingHourPayload[];
	createdAt: string;
	updatedAt: string;
}

export interface StorefrontReview {
	id: string;
	rating: number;
	comment: string;
	customerName?: string;
	createdAt: string;
}

export interface StorefrontResponse {
	business: StorefrontBusinessProfile;
	averageRating: number;
	reviews: StorefrontReview[];
}

export interface GetStorefrontParams {
	slug: string;
	page?: number;
	limit?: number;
}
