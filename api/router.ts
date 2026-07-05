import { router } from "react-query-kit";
import * as authApi from "./auth";
import * as businessApi from "./business";
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

export const upload = router("upload", {
	logo: router.mutation({
		mutationFn: uploadApi.uploadLogo,
	}),
	cover: router.mutation({
		mutationFn: uploadApi.uploadCover,
	}),
});
