"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"
import { account } from "@/services/router"
import { PayoutAccountPayload } from "@/services/types/account.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MaterialIcon from "@/components/ui/material-icon"
import { PayoutAccountModal } from "@/components/payout/payout-account-modal"
import { NoPayoutAccountModal } from "@/components/payout/no-payout-account-modal"

type WithdrawalStatus = "PROCESSED" | "PENDING" | "FAILED"
type PayoutStatus = "PROCESSED" | "PENDING" | "FAILED"

interface WithdrawalRecord {
  id: string
  amount: string
  bankName: string
  accountNumber: string
  nombaTxRef: string
  createdAt: string
  status: WithdrawalStatus
}

interface RiderPayoutRecord {
  riderId: string
  riderName: string
  vehicle: string
  completedDeliveries: number
  perDelivery: string
  totalDue: string
  lastPayout: string
  status: PayoutStatus
  nombaTxRef?: string
  bankName: string
}

const withdrawalHistory: WithdrawalRecord[] = [
  { id: "WD-0011", amount: "₦45,000", bankName: "First Bank", accountNumber: "****7821", nombaTxRef: "NMB-TRF-44210", createdAt: "2026-06-28 14:22", status: "PROCESSED" },
  { id: "WD-0010", amount: "₦30,000", bankName: "GTBank", accountNumber: "****7821", nombaTxRef: "NMB-TRF-43187", createdAt: "2026-06-21 10:05", status: "PROCESSED" },
  { id: "WD-0009", amount: "₦20,000", bankName: "First Bank", accountNumber: "****7821", nombaTxRef: "NMB-TRF-42001", createdAt: "2026-06-14 09:41", status: "FAILED" },
  { id: "WD-0008", amount: "₦50,000", bankName: "First Bank", accountNumber: "****7821", nombaTxRef: "NMB-TRF-41092", createdAt: "2026-06-07 16:30", status: "PROCESSED" },
]

const riderPayouts: RiderPayoutRecord[] = [
  { riderId: "RID-001", riderName: "Chukwuemeka Dike", vehicle: "Motorcycle", completedDeliveries: 12, perDelivery: "₦3,500", totalDue: "₦42,000", lastPayout: "2026-06-21", status: "PENDING", bankName: "First Bank" },
  { riderId: "RID-002", riderName: "Akin Joseph", vehicle: "Motorcycle", completedDeliveries: 18, perDelivery: "₦3,500", totalDue: "₦63,000", lastPayout: "2026-06-14", status: "PENDING", bankName: "GTBank" },
  { riderId: "RID-003", riderName: "Femi Ade", vehicle: "Van", completedDeliveries: 8, perDelivery: "₦4,200", totalDue: "₦33,600", lastPayout: "2026-06-21", status: "PENDING", bankName: "Access Bank" },
  { riderId: "RID-004", riderName: "David Okoye", vehicle: "Electric Moped", completedDeliveries: 11, perDelivery: "₦3,200", totalDue: "₦35,200", lastPayout: "2026-06-21", status: "PROCESSED", nombaTxRef: "NMB-TRF-43190", bankName: "Zenith Bank" },
  { riderId: "RID-005", riderName: "Sola Badmus", vehicle: "Motorcycle", completedDeliveries: 6, perDelivery: "₦3,500", totalDue: "₦21,000", lastPayout: "2026-06-14", status: "PENDING", bankName: "UBA" },
]

const statusConfig = {
  PROCESSED: { label: "Processed", bg: "bg-secondary/10", text: "text-secondary-two", icon: "check_circle" },
  PENDING: { label: "Pending", bg: "bg-amber-100", text: "text-amber-700", icon: "schedule" },
  FAILED: { label: "Failed", bg: "bg-red-100", text: "text-red-600", icon: "error" },
}

const banks = [
  "Access Bank", "Citibank", "Ecobank", "Fidelity Bank", "First Bank of Nigeria",
  "First City Monument Bank", "Globus Bank", "GTBank", "Heritage Bank", "Keystone Bank",
  "Kuda Bank", "Opay", "Palmpay", "Polaris Bank", "Providus Bank", "Stanbic IBTC",
  "Standard Chartered", "Sterling Bank", "SunTrust Bank", "UBA", "Union Bank",
  "Unity Bank", "VFD Microfinance Bank", "Wema Bank", "Zenith Bank",
]

function WithdrawModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"amount" | "confirm">("amount")
  const [amount, setAmount] = useState("")
  const [bank, setBank] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [looking, setLooking] = useState(false)

  const lookupAccount = () => {
    if (accountNumber.length < 10) return
    setLooking(true)
    setTimeout(() => {
      setAccountName("SPEEDEX COURIERS LIMITED")
      setLooking(false)
    }, 1200)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-popover rounded-2xl border border-border p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-primary">Withdraw Funds</h3>
          <button onClick={onClose}>
            <MaterialIcon name="close" size={20} color="var(--muted-foreground)" />
          </button>
        </div>

        {/* Nomba badge */}
        <div className="flex items-center gap-2 bg-primary/5 rounded-xl p-3 mb-5">
          <MaterialIcon name="verified_user" size={16} color="var(--primary)" />
          <span className="text-xs text-muted-foreground font-medium">Powered by <strong className="text-primary">Nomba</strong> Transfer API</span>
        </div>

        {step === "amount" && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1.5">Withdrawal Amount (₦)</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="bg-silver-two border-0 focus-visible:ring-secondary text-lg font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1.5">Bank</label>
              <select
                value={bank}
                onChange={e => setBank(e.target.value)}
                className="w-full bg-silver-two rounded-xl px-4 py-2.5 text-sm border-0 outline-none focus:ring-2 focus:ring-secondary text-foreground"
              >
                <option value="">Select bank...</option>
                {banks.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1.5">Account Number</label>
              <div className="flex gap-2">
                <Input
                  placeholder="10-digit account number"
                  maxLength={10}
                  value={accountNumber}
                  onChange={e => { setAccountNumber(e.target.value); setAccountName("") }}
                  className="bg-silver-two border-0 focus-visible:ring-secondary"
                />
                <Button variant="ghost" size="icon" onClick={lookupAccount} disabled={accountNumber.length < 10 || looking}>
                  {looking
                    ? <MaterialIcon name="hourglass_empty" size={16} color="var(--muted-foreground)" />
                    : <MaterialIcon name="search" size={16} color="var(--primary)" />
                  }
                </Button>
              </div>
              {accountName && (
                <div className="mt-2 flex items-center gap-2 text-xs text-secondary-two font-bold">
                  <MaterialIcon name="check_circle" size={14} color="var(--secondary)" />
                  {accountName}
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
              <Button
                className="flex-1"
                disabled={!amount || !bank || !accountNumber || !accountName}
                onClick={() => setStep("confirm")}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4">
            <div className="bg-silver-two rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-extrabold text-primary text-lg">₦{Number(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bank</span>
                <span className="font-semibold">{bank}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account</span>
                <span className="font-semibold">{accountNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Name</span>
                <span className="font-semibold text-secondary-two">{accountName}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between text-xs text-muted-foreground">
                <span>Fee</span>
                <span>₦{Math.min(Math.round(Number(amount) * 0.014), 1800).toLocaleString()}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              By confirming, a transfer will be initiated via the Nomba Transfer API. A unique <strong>merchantTxRef</strong> will be generated to prevent duplicate transfers.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setStep("amount")}>Back</Button>
              <Button className="flex-1" onClick={onClose}>
                <MaterialIcon name="send" size={14} color="white" />
                Confirm Withdrawal
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function RiderPayoutModal({ rider, onClose }: { rider: RiderPayoutRecord; onClose: () => void }) {
  const [accountName, setAccountName] = useState("")
  const [looking, setLooking] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const lookup = () => {
    setLooking(true)
    setTimeout(() => {
      setAccountName(rider.riderName.toUpperCase())
      setLooking(false)
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-popover rounded-2xl border border-border p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-primary">Rider Payout</h3>
          <button onClick={onClose}>
            <MaterialIcon name="close" size={20} color="var(--muted-foreground)" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-extrabold text-primary">
            {rider.riderName.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <div className="font-bold text-foreground">{rider.riderName}</div>
            <div className="text-xs text-muted-foreground">{rider.bankName} • {rider.vehicle}</div>
          </div>
        </div>

        <div className="bg-silver-two rounded-xl p-4 space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Completed Deliveries</span>
            <span className="font-bold">{rider.completedDeliveries}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Rate per Delivery</span>
            <span className="font-bold">{rider.perDelivery}</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="text-muted-foreground font-bold">Total Due</span>
            <span className="font-extrabold text-primary text-lg">{rider.totalDue}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-primary/5 rounded-xl p-3 mb-5">
          <MaterialIcon name="verified_user" size={16} color="var(--primary)" />
          <span className="text-xs text-muted-foreground">Account verified via <strong className="text-primary">Nomba Bank Lookup</strong></span>
        </div>

        {!accountName ? (
          <Button className="w-full" onClick={lookup} disabled={looking}>
            {looking
              ? <><MaterialIcon name="hourglass_empty" size={14} color="white" /> Verifying account...</>
              : <><MaterialIcon name="search" size={14} color="white" /> Verify Recipient Account</>
            }
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-secondary-two font-bold bg-secondary/5 rounded-xl p-3">
              <MaterialIcon name="check_circle" size={16} color="var(--secondary)" />
              Verified: {accountName}
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
              <Button className="flex-1" onClick={() => { setConfirmed(true); setTimeout(onClose, 800) }}>
                <MaterialIcon name="send" size={14} color="white" />
                {confirmed ? "Sending..." : `Pay ${rider.totalDue}`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PayoutPage() {
  const [withdrawModal, setWithdrawModal] = useState(false)
  const [payoutRider, setPayoutRider] = useState<RiderPayoutRecord | null>(null)
  const [accountFormOpen, setAccountFormOpen] = useState(false)
  const [noAccountPromptDismissed, setNoAccountPromptDismissed] = useState(false)

  const queryClient = useQueryClient()

  const { data: payoutAccountData, isLoading: accountLoading, isError: accountIsError, error: accountError } =
    account.getPayoutAccount.useQuery({ retry: false })

  const payoutAccount = payoutAccountData?.data ?? null
  const accountNotFound =
    !accountLoading && (!payoutAccount || (accountIsError && (accountError as AxiosError)?.response?.status === 404))
  const noAccountPromptOpen = accountNotFound && !noAccountPromptDismissed

  const invalidateAccount = () => queryClient.invalidateQueries({ queryKey: ["account"] })

  const handleAccountError = (error: Error, fallback: string) =>
    toast.error((error as AxiosError<{ message: string }>).response?.data?.message || fallback)

  const createAccountMutation = account.createPayoutAccount.useMutation({
    onSuccess: () => {
      invalidateAccount()
      toast.success("Payout account added")
      setAccountFormOpen(false)
      setNoAccountPromptDismissed(true)
    },
    onError: (e) => handleAccountError(e, "Failed to add payout account"),
  })

  const updateAccountMutation = account.updatePayoutAccount.useMutation({
    onSuccess: () => {
      invalidateAccount()
      toast.success("Payout account updated")
      setAccountFormOpen(false)
    },
    onError: (e) => handleAccountError(e, "Failed to update payout account"),
  })

  const handleAccountSubmit = (payload: PayoutAccountPayload) => {
    if (payoutAccount) {
      updateAccountMutation.mutate(payload)
    } else {
      createAccountMutation.mutate(payload)
    }
  }

  const pendingPayoutsTotal = riderPayouts
    .filter(r => r.status === "PENDING")
    .reduce((sum, r) => sum + parseInt(r.totalDue.replace(/[₦,]/g, "")), 0)

  return (
    <div className="px-6 lg:px-10 py-8 space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Payout</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Business wallet and Nomba-powered withdrawals & rider payouts</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/5 rounded-xl px-4 py-2">
          <MaterialIcon name="verified_user" size={16} color="var(--primary)" />
          <span className="text-xs font-bold text-primary">Powered by Nomba API</span>
        </div>
      </div>

      {/* Payout Account */}
      <div className="bg-popover rounded-2xl border border-border p-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <MaterialIcon name="account_balance" size={22} color="var(--primary)" />
          </div>
          <div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Payout Account</div>
            {accountLoading ? (
              <div className="text-sm font-semibold text-muted-foreground mt-0.5">Loading account...</div>
            ) : payoutAccount ? (
              <>
                <div className="font-bold text-foreground text-sm">{payoutAccount.accountName}</div>
                <div className="text-xs text-muted-foreground">{payoutAccount.bankName} · {payoutAccount.accountNumber}</div>
              </>
            ) : (
              <div className="text-sm font-bold text-amber-700 mt-0.5">No bank account added</div>
            )}
          </div>
        </div>
        {!accountLoading && (
          payoutAccount ? (
            <Button size="sm" variant="ghost" onClick={() => setAccountFormOpen(true)}>
              <MaterialIcon name="edit" size={14} color="var(--primary)" />
              Edit
            </Button>
          ) : (
            <Button size="sm" onClick={() => setAccountFormOpen(true)}>
              <MaterialIcon name="add" size={14} color="white" />
              Add Account
            </Button>
          )
        )}
      </div>

      {/* Wallet & summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1 bg-primary rounded-2xl p-6 text-primary-foreground relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <MaterialIcon name="account_balance_wallet" size={18} color="rgba(255,255,255,0.7)" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Nomba Wallet</span>
            </div>
            <div className="text-4xl font-extrabold tracking-tight mb-1">₦184,500</div>
            <div className="text-xs text-white/60 mb-4">Available balance</div>
            <Button
              variant="secondary"
              size="sm"
              className="w-full font-bold"
              onClick={() => setWithdrawModal(true)}
            >
              <MaterialIcon name="send" size={14} color="var(--secondary-foreground)" />
              Withdraw Funds
            </Button>
          </div>
        </div>

        <div className="bg-popover rounded-2xl border border-border p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <MaterialIcon name="payments" size={18} color="var(--secondary)" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Earned</span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-primary">₦1,248,000</div>
            <div className="text-xs text-muted-foreground mt-0.5">All time</div>
          </div>
          <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
            This month: <strong className="text-foreground">₦184,500</strong>
          </div>
        </div>

        <div className="bg-popover rounded-2xl border border-border p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <MaterialIcon name="pending_actions" size={18} color="#D97706" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Pending Payouts</span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-primary">₦{pendingPayoutsTotal.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Across {riderPayouts.filter(r => r.status === "PENDING").length} riders</div>
          </div>
          <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
            Last payout: <strong className="text-foreground">2026-06-21</strong>
          </div>
        </div>
      </div>

      {/* Rider Payouts */}
      <div className="bg-popover rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="font-bold text-primary">Rider Payouts</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Settled after each delivery via Nomba Transfer API</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-silver-two border-b border-border">
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Rider</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hidden md:table-cell">Deliveries</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hidden lg:table-cell">Bank</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Due</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="text-right px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {riderPayouts.map(r => {
                const cfg = statusConfig[r.status]
                return (
                  <tr key={r.riderId} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-extrabold text-primary shrink-0">
                          {r.riderName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-sm">{r.riderName}</div>
                          <div className="text-xs text-muted-foreground">{r.vehicle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="font-bold text-foreground">{r.completedDeliveries}</div>
                      <div className="text-xs text-muted-foreground">@ {r.perDelivery} each</div>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell text-sm text-muted-foreground">{r.bankName}</td>
                    <td className="px-5 py-4 font-extrabold text-primary">{r.totalDue}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${cfg.bg} ${cfg.text}`}>
                        <MaterialIcon name={cfg.icon} size={11} color="currentColor" />
                        {cfg.label}
                      </span>
                      {r.nombaTxRef && (
                        <div className="text-[10px] text-muted-foreground/60 mt-0.5 font-mono">{r.nombaTxRef}</div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {r.status === "PENDING" ? (
                        <Button size="sm" onClick={() => setPayoutRider(r)}>
                          <MaterialIcon name="send" size={12} color="white" />
                          Pay Rider
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" className="text-muted-foreground text-xs">
                          History
                        </Button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawal History */}
      <div className="bg-popover rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-bold text-primary">Withdrawal History</h2>
          <Button size="sm" variant="ghost" className="text-xs text-secondary font-bold">Export</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-silver-two border-b border-border">
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Ref</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Amount</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hidden md:table-cell">Bank</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hidden lg:table-cell">Nomba Ref</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hidden md:table-cell">Date</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {withdrawalHistory.map(w => {
                const cfg = statusConfig[w.status]
                return (
                  <tr key={w.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs font-bold text-muted-foreground">{w.id}</td>
                    <td className="px-5 py-4 font-extrabold text-primary">{w.amount}</td>
                    <td className="px-5 py-4 hidden md:table-cell text-sm text-muted-foreground">
                      {w.bankName} · {w.accountNumber}
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell font-mono text-xs text-muted-foreground/70">{w.nombaTxRef}</td>
                    <td className="px-5 py-4 hidden md:table-cell text-xs text-muted-foreground">{w.createdAt}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${cfg.bg} ${cfg.text}`}>
                        <MaterialIcon name={cfg.icon} size={11} color="currentColor" />
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {withdrawModal && <WithdrawModal onClose={() => setWithdrawModal(false)} />}
      {payoutRider && <RiderPayoutModal rider={payoutRider} onClose={() => setPayoutRider(null)} />}

      <NoPayoutAccountModal
        isOpen={noAccountPromptOpen}
        onClose={() => setNoAccountPromptDismissed(true)}
        onAddAccount={() => { setNoAccountPromptDismissed(true); setAccountFormOpen(true) }}
      />

      {accountFormOpen && (
        <PayoutAccountModal
          isOpen={accountFormOpen}
          account={payoutAccount}
          onClose={() => setAccountFormOpen(false)}
          onSubmit={handleAccountSubmit}
          isPending={createAccountMutation.isPending || updateAccountMutation.isPending}
        />
      )}
    </div>
  )
}
