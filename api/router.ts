import { router } from "react-query-kit";
import * as authApi from "./auth";
import * as businessApi from "./business";
import * as riderApi from "./rider";
import { RiderListParams } from "./types/rider.types";
import * as orderApi from "./order";
import * as uploadApi from "./upload";

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
			const params = variables.queryKey[2] as RiderListParams | undefined
			return riderApi.getAllRiders(params)
		},
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
		mutationFn: ({ riderId }: { riderId: string }) => riderApi.deleteRider(riderId),
	}),
	updateAvailability: router.mutation({
		mutationFn: ({
			riderId,
			...payload
		}: { riderId: string } & Parameters<typeof riderApi.updateRiderAvailability>[1]) =>
			riderApi.updateRiderAvailability(riderId, payload),
	}),
	updateLocation: router.mutation({
		mutationFn: ({
			riderId,
			...payload
		}: { riderId: string } & Parameters<typeof riderApi.updateRiderLocation>[1]) =>
			riderApi.updateRiderLocation(riderId, payload),
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
});

export const upload = router("upload", {
	logo: router.mutation({
		mutationFn: uploadApi.uploadLogo,
	}),
	cover: router.mutation({
		mutationFn: uploadApi.uploadCover,
	}),
});
