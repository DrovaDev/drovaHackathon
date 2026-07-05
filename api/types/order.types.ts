import { BusinessProfileResponse, VehicleType } from "./business.types";

export type OrderStatus =
	| "pending"
	| "quotation"
	| "payment_confirmed"
	| "offer_pending"
	| "assigned"
	| "en_route_pickup"
	| "picked_up"
	| "in_transit"
	| "arrived_at_delivery"
	| "completed"
	| "disputed"
	| "cancelled";

export type OrderStatusFilter = "all" | OrderStatus;

export type OrderPaymentStatus =
	| "pending"
	| "held"
	| "released"
	| "refunded"
	| "failed";

export type OrderPickupMethod = "business_pickup" | "walk_in";

export type OrderDeliveryPriority = "express" | "scheduled";

export type SortOrder = "asc" | "desc";

export interface GeoPoint {
	type: "Point";
	coordinates: [longitude: number, latitude: number];
}

export interface OrderItem {
	id: string;
	orderId: string;
	packageName: string;
	packageDescription: string;
	packageType: string;
	quantity: number;
	estimatedValue: number;
	estimatedWeight: number;
	specialInstructions: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface OrderParties {
	id: string;
	orderId: string;
	guestFullName: string;
	guestContactNumber: string;
	guestEmail: string;
	recipientFullName: string;
	recipientContactNumber: string;
	recipientEmail: string;
	createdAt: string;
	updatedAt: string;
}

export interface OrderLocations {
	id: string;
	orderId: string;
	pickupAddress: string;
	pickupCoordinates: GeoPoint;
	pickupCity: string;
	pickupState: string;
	pickupNearestLandmark: string | null;
	pickupContactPersonName: string | null;
	pickupContactPersonPhone: string | null;
	deliveryAddress: string;
	deliveryCoordinates: GeoPoint;
	deliveryState: string;
	deliveryNearestLandmark: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface OrderTracking {
	id: string;
	orderId: string;
	confirmedAt: string | null;
	assignedAt: string | null;
	enRoutePickupAt: string | null;
	pickedUpAt: string | null;
	inTransitAt: string | null;
	arrivedAtDeliveryAt: string | null;
	deliveredAt: string | null;
	completedAt: string | null;
	cancelledAt: string | null;
	cancellationReason: string | null;
	cancelledBy: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface OrderRider {
	id: string;
	authId: string;
	businessId: string;
	firstName: string;
	lastName: string;
	otherName: string | null;
	phoneNumber: string;
	profilePhoto: string | null;
	vehicleType: VehicleType;
	vehiclePlateNumber: string;
	vehicleModel: string;
	vehicleColor: string;
	status: string;
	isDeleted: boolean;
	hasChangedPassword: boolean;
	inviteStatus: string;
	availabilityStatus: string;
	lastKnownLocation: GeoPoint | null;
	lastLocationUpdatedAt: string | null;
	activeDeviceId: string | null;
	sessionId: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface Order {
	id: string;
	referenceCode: string;
	businessId: string;
	riderId: string | null;
	status: OrderStatus;
	pickupMethod: OrderPickupMethod;
	deliveryPriority: OrderDeliveryPriority | null;
	prefferedDeliveryTime: string | null;
	customerNote: string | null;
	pickupInstructions: string | null;
	deliveryInstructions: string | null;
	deliveryFee: number;
	pickupFee: number;
	packagingFee: number;
	serviceFee: number;
	platformCommission: number;
	businessPayout: number;
	paymentStatus: OrderPaymentStatus;
	paymentReference: string | null;
	paymentLink: string | null;
	totalAmount: number | null;
	priceBreakdown: Record<string, unknown> | null;
	invoiceSentAt: string | null;
	isDeleted: boolean;
	offerExpiresAt: string | null;
	cancelledBy: string | null;
	cancelledAt: string | null;
	cancellationReason: string | null;
	paidAt: string | null;
	escrowHeldAt: string | null;
	escrowReleasedAt: string | null;
	rider: OrderRider | null;
	items: OrderItem[];
	parties: OrderParties;
	locations: OrderLocations;
	tracking: OrderTracking;
	createdAt: string;
	updatedAt: string;
}

export interface GetOrdersParams {
	page?: number;
	limit?: number;
	sortOrder?: SortOrder | null;
	search?: string;
	status?: OrderStatusFilter;
	paymentStatus?: OrderPaymentStatus;
	pickupMethod?: OrderPickupMethod | null;
	deliveryPriority?: OrderDeliveryPriority | null;
	startDate?: string;
	endDate?: string;
}

export type GetQuotationsParams = Pick<
	GetOrdersParams,
	"page" | "limit" | "sortOrder" | "search" | "startDate" | "endDate"
>;

export interface OrderDetail extends Order {
	business: BusinessProfileResponse;
}
