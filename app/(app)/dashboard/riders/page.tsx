"use client"

import { useState, useCallback } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { rider } from "@/api/router"
import { getAllRiders } from "@/api/rider"
import { RiderProfile, CreateRiderProfilePayload, UpdateRiderProfilePayload, RiderListParams, RiderInviteStatus, RiderStatus } from "@/api/types/rider.types"
import { Button } from "@/components/ui/button"
import MaterialIcon from "@/components/ui/material-icon"
import { toast } from "sonner"
import { AxiosError } from "axios"
import {
	FleetSummaryCards,
	RiderFilters,
	RiderGrid,
	InviteRiderModal,
	RiderDetailModal,
	EditRiderModal,
	ConfirmSuspendModal,
	Pagination,
	FilterStatus,
} from "@/components/riders"

const PAGE_SIZE = 20

let searchTimer: ReturnType<typeof setTimeout>

function debounce(fn: () => void, ms: number) {
	clearTimeout(searchTimer)
	searchTimer = setTimeout(fn, ms)
}

export default function RidersPage() {
	const queryClient = useQueryClient()
	const [page, setPage] = useState(1)
	const [search, setSearch] = useState("")
	const [debouncedSearch, setDebouncedSearch] = useState("")
	const [filter, setFilter] = useState<FilterStatus>("ALL")
	const [inviteStatus, setInviteStatus] = useState<RiderInviteStatus | "ALL">("ALL")
	const [riderStatus, setRiderStatus] = useState<RiderStatus | "ALL">("ALL")
	const [sortBy, setSortBy] = useState("")
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
	const [startDate, setStartDate] = useState("")
	const [endDate, setEndDate] = useState("")
	const [inviteModal, setInviteModal] = useState(false)
	const [selectedRider, setSelectedRider] = useState<RiderProfile | null>(null)
	const [editRider, setEditRider] = useState<RiderProfile | null>(null)
	const [confirmDeleteRider, setConfirmDeleteRider] = useState<RiderProfile | null>(null)

	const handleSearchChange = useCallback((value: string) => {
		setSearch(value)
		setPage(1)
		debounce(() => setDebouncedSearch(value), 300)
	}, [])

	const handleFilterChange = useCallback((value: FilterStatus) => {
		setFilter(value)
		setPage(1)
	}, [])

	const handleClearFilters = useCallback(() => {
		setSearch("")
		setDebouncedSearch("")
		setFilter("ALL")
		setInviteStatus("ALL")
		setRiderStatus("ALL")
		setSortBy("")
		setSortOrder("desc")
		setStartDate("")
		setEndDate("")
		setPage(1)
	}, [])

	const queryParams: RiderListParams = {
		page,
		limit: PAGE_SIZE,
		...(debouncedSearch && { search: debouncedSearch }),
		...(filter !== "ALL" && { availabilityStatus: filter }),
		...(inviteStatus !== "ALL" && { inviteStatus }),
		...(riderStatus !== "ALL" && { status: riderStatus }),
		...(sortBy && { sortBy, sortOrder }),
		...(startDate && { startDate }),
		...(endDate && { endDate }),
	}

	const { data: ridersData, isLoading } = useQuery({
		queryKey: ["rider", "list", queryParams],
		queryFn: () => getAllRiders(queryParams),
	})

	const riders = ridersData?.data ?? []
	const meta = ridersData?.meta
	const totalPages = meta?.totalPages ?? 1

	const handleError = (error: Error, fallback: string) =>
		toast.error((error as AxiosError<{ message: string }>).response?.data?.message || fallback)

	const invalidate = () => queryClient.invalidateQueries({ queryKey: ["rider"] })

	const createMutation = rider.create.useMutation({
		onSuccess: () => { invalidate(); toast.success("Rider invitation sent"); setInviteModal(false) },
		onError: (e) => handleError(e, "Failed to invite rider"),
	})

	const deleteMutation = rider.delete.useMutation({
		onSuccess: () => { invalidate(); toast.success("Rider suspended"); setConfirmDeleteRider(null); setSelectedRider(null) },
		onError: (e) => handleError(e, "Failed to suspend rider"),
	})

	const availabilityMutation = rider.updateAvailability.useMutation({
		onSuccess: (data) => { invalidate(); if (data?.data && selectedRider) setSelectedRider({ ...selectedRider, ...data.data }); toast.success("Availability updated") },
		onError: (e) => handleError(e, "Failed to update availability"),
	})

	const updateProfileMutation = rider.update.useMutation({
		onSuccess: () => { invalidate(); toast.success("Profile updated"); setEditRider(null); setSelectedRider(null) },
		onError: (e) => handleError(e, "Failed to update profile"),
	})

	const resendOtpMutation = rider.resendOtp.useMutation({
		onSuccess: () => toast.success("OTP resent"),
		onError: (e) => handleError(e, "Failed to resend OTP"),
	})

	return (
		<div className="px-6 lg:px-10 py-8 space-y-6">
			<div className="flex items-start justify-between gap-4 flex-wrap">
				<div>
					<h1 className="text-2xl font-extrabold text-primary tracking-tight">Rider Management</h1>
					<p className="text-muted-foreground text-sm mt-0.5">Onboard, monitor, and manage your delivery fleet</p>
				</div>
				<Button onClick={() => setInviteModal(true)} className="gap-2">
					<MaterialIcon name="person_add" size={16} color="white" />
					Invite Rider
				</Button>
			</div>

			<FleetSummaryCards
				total={meta?.count ?? riders.length}
				available={riders.filter(r => r.availabilityStatus === "available").length}
				onDelivery={riders.filter(r => r.availabilityStatus === "on_trip").length}
				offline={riders.filter(r => r.availabilityStatus === "offline").length}
			/>

			<RiderFilters
				search={search}
				onSearchChange={handleSearchChange}
				filter={filter}
				onFilterChange={handleFilterChange}
				inviteStatus={inviteStatus}
				onInviteStatusChange={v => { setInviteStatus(v); setPage(1) }}
				riderStatus={riderStatus}
				onRiderStatusChange={v => { setRiderStatus(v); setPage(1) }}
				sortBy={sortBy}
				onSortByChange={setSortBy}
				sortOrder={sortOrder}
				onSortOrderChange={setSortOrder}
				startDate={startDate}
				onStartDateChange={setStartDate}
				endDate={endDate}
				onEndDateChange={setEndDate}
				onClearFilters={handleClearFilters}
			/>

			<RiderGrid riders={riders} isLoading={isLoading} onRiderClick={setSelectedRider} />

			<Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

			<InviteRiderModal isOpen={inviteModal} onClose={() => setInviteModal(false)} onSubmit={p => createMutation.mutate(p)} isPending={createMutation.isPending} />

			<RiderDetailModal
				rider={selectedRider}
				onClose={() => setSelectedRider(null)}
				onEdit={setEditRider}
				onSuspend={setConfirmDeleteRider}
				onResendOtp={r => resendOtpMutation.mutate({ telephoneNumber: r.telephoneNumber })}
				onUpdateAvailability={(id, status) => availabilityMutation.mutate({ riderId: id, availabilityStatus: status })}
				isUpdatingAvailability={availabilityMutation.isPending}
			/>

			<EditRiderModal
				rider={editRider}
				onClose={() => setEditRider(null)}
				onSubmit={p => updateProfileMutation.mutate(p)}
				isPending={updateProfileMutation.isPending}
			/>

			<ConfirmSuspendModal
				rider={confirmDeleteRider}
				onClose={() => setConfirmDeleteRider(null)}
				onConfirm={() => { if (confirmDeleteRider) deleteMutation.mutate({ riderId: confirmDeleteRider.id }) }}
				isPending={deleteMutation.isPending}
			/>
		</div>
	)
}
