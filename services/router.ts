import { router } from "react-query-kit";
import * as authApi from "./auth";
import * as businessApi from "./business";
import * as riderApi from "./rider";
import { RiderListParams } from "./types/rider.types";
import * as orderApi from "./order";
import * as analyticsApi from "./analytics";
import * as uploadApi from "./upload";
import * as accountApi from "./account";
import * as transactionApi from "./transaction";
import * as walletApi from "./wallet";
import * as notificationApi from "./notification";
import { GetNotificationsParams } from "./types/notification.types";

export const auth = router("auth", {
	login: router.mutation({
		mutationFn: authApi.login,
	}),
	register: router.mutation({
		mutationFn: authApi.register,
	}),
	validateEmail: router.mutation({
		mutationFn: authApi.validateEmail,
	}),
	resendOTP: router.mutation({
		mutationFn: authApi.resendOTP,
	}),
	forgotPassword: router.mutation({
		mutationFn: authApi.forgotPassword,
	}),
	validateOTP: router.mutation({
		mutationFn: authApi.validateOTP,
	}),
	resetPassword: router.mutation({
		mutationFn: authApi.resetPassword,
	}),
	changePassword: router.mutation({
		mutationFn: authApi.changePassword,
	}),
});

export const business = router("business", {
	getProfile: router.query({
		fetcher: businessApi.getProfile,
	}),
	profileSetup: router.mutation({
		mutationFn: businessApi.profileSetup,
	}),
	profileEdit: router.mutation({
		mutationFn: businessApi.profileEdit,
	}),
	setDeliveryPricing: router.mutation({
		mutationFn: businessApi.setDeliveryPricing,
	}),
	validateTIN: router.mutation({
		mutationFn: businessApi.validateTIN,
	}),
	getBusinessStates: router.query({
		fetcher: businessApi.getBusinessStates,
	}),
	getBusinessLookups: router.query({
		fetcher: businessApi.getBusinessLookups,
	}),
});

export const rider = router("rider", {
	list: router.query({
		fetcher: async (variables: { queryKey: readonly unknown[] }) => {
			const params = variables.queryKey[2] as RiderListParams | undefined;
			return riderApi.getAllRiders(params);
		},
	}),
	listAssignable: router.query({
		fetcher: (variables: RiderListParams) =>
			riderApi.getAssignableRiders(variables),
	}),
	getById: router.query({
		fetcher: ({ queryKey }) => {
			const [, riderId] = queryKey;
			return riderApi.getRiderById(riderId as string);
		},
	}),
	create: router.mutation({
		mutationFn: riderApi.createRiderProfile,
	}),
	update: router.mutation({
		mutationFn: riderApi.updateRiderProfile,
	}),
	delete: router.mutation({
		mutationFn: ({ riderId }: { riderId: string }) =>
			riderApi.deleteRider(riderId),
	}),
	updateAvailability: router.mutation({
		mutationFn: ({
			riderId,
			...payload
		}: { riderId: string } & Parameters<
			typeof riderApi.updateRiderAvailability
		>[1]) => riderApi.updateRiderAvailability(riderId, payload),
	}),
	updateLocation: router.mutation({
		mutationFn: ({
			riderId,
			...payload
		}: { riderId: string } & Parameters<
			typeof riderApi.updateRiderLocation
		>[1]) => riderApi.updateRiderLocation(riderId, payload),
	}),
	resendOtp: router.mutation({
		mutationFn: riderApi.resendRiderOtp,
	}),
	validateOtp: router.mutation({
		mutationFn: riderApi.validateRiderOtp,
	}),
});

export const order = router("order", {
	getOrders: router.query({
		fetcher: orderApi.getOrders,
	}),
	getQuotations: router.query({
		fetcher: orderApi.getQuotations,
	}),
	getOrder: router.query({
		fetcher: (variables: { id: string }) => orderApi.getOrder(variables.id),
	}),
	createInvoice: router.mutation({
		mutationFn: ({
			id,
			...payload
		}: { id: string } & Parameters<typeof orderApi.createInvoice>[1]) =>
			orderApi.createInvoice(id, payload),
	}),
	resendInvoice: router.mutation({
		mutationFn: ({ id }: { id: string }) => orderApi.resendInvoice(id),
	}),
	manuallyAssignOrder: router.mutation({
		mutationFn: orderApi.manuallyAssignOrder,
	}),
	createDirectOrder: router.mutation({
		mutationFn: orderApi.createDirectOrder,
	}),
});

export const account = router("account", {
	getPayoutAccount: router.query({
		fetcher: accountApi.getBusinessPayoutAccount,
	}),
	getBanks: router.query({
		fetcher: accountApi.getBanks,
	}),
	createPayoutAccount: router.mutation({
		mutationFn: accountApi.createBusinessPayoutAccount,
	}),
	updatePayoutAccount: router.mutation({
		mutationFn: accountApi.updateBusinessPayoutAccount,
	}),
	resolveBankAccount: router.mutation({
		mutationFn: accountApi.resolveBankAccount,
	}),
});

export const transaction = router("transaction", {
	getMyPayouts: router.query({
		fetcher: transactionApi.getMyPayouts,
	}),
	getTransactions: router.query({
		fetcher: transactionApi.getTransactions,
	}),
	requestPayout: router.mutation({
		mutationFn: transactionApi.requestPayout,
	}),
});

export const wallet = router("wallet", {
	get: router.query({
		fetcher: walletApi.getWallet,
	}),
});

export const notification = router("notification", {
	inbox: router.query({
		fetcher: (variables: GetNotificationsParams) =>
			notificationApi.getInbox(variables),
	}),
	unreadCount: router.query({
		fetcher: notificationApi.getUnreadCount,
	}),
	markAllRead: router.mutation({
		mutationFn: notificationApi.markAllRead,
	}),
	markOneRead: router.mutation({
		mutationFn: ({ id }: { id: string }) => notificationApi.markOneRead(id),
	}),
});

export const upload = router("upload", {
	logo: router.mutation({
		mutationFn: uploadApi.uploadLogo,
	}),
	cover: router.mutation({
		mutationFn: uploadApi.uploadCover,
	}),
});

export const analytics = router("analytics", {
	businessSummary: router.query({
		fetcher: analyticsApi.getBusinessSummary,
	}),
	businessOrdersTrend: router.query({
		fetcher: analyticsApi.getBusinessOrdersTrend,
	}),
	businessOrdersBreakdown: router.query({
		fetcher: analyticsApi.getBusinessOrdersBreakdown,
	}),
	businessRevenueBreakdown: router.query({
		fetcher: analyticsApi.getBusinessRevenueBreakdown,
	}),
	businessRidersSummary: router.query({
		fetcher: analyticsApi.getBusinessRidersSummary,
	}),
	businessRidersPerformance: router.query({
		fetcher: analyticsApi.getBusinessRidersPerformance,
	}),
	businessOrdersFulfillment: router.query({
		fetcher: analyticsApi.getBusinessOrdersFulfillment,
	}),
	riderSummary: router.query({
		fetcher: analyticsApi.getRiderSummary,
	}),
	riderEarningsSummary: router.query({
		fetcher: analyticsApi.getRiderEarningsSummary,
	}),
	riderEarningsTrend: router.query({
		fetcher: analyticsApi.getRiderEarningsTrend,
	}),
	riderOrdersTrend: router.query({
		fetcher: analyticsApi.getRiderOrdersTrend,
	}),
	riderPerformance: router.query({
		fetcher: analyticsApi.getRiderPerformance,
	}),
});
