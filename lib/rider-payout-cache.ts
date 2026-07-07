import { LedgerTransaction } from "@/services/types/transaction.types"

const STORAGE_PREFIX = "rider-payout:"

/**
 * There is no single-transaction GET endpoint yet, so the detail page is fed
 * from the row the user clicked in the list. Stashed in sessionStorage (not
 * just component state) so a hard refresh of the detail route still works
 * within the same tab.
 */
export function cacheRiderPayoutTransaction(transaction: LedgerTransaction): void {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}${transaction.id}`, JSON.stringify(transaction))
  } catch {
    // sessionStorage unavailable (e.g. private browsing quota) - detail page falls back to the list query
  }
}

export function getCachedRiderPayoutTransaction(id: string): LedgerTransaction | undefined {
  if (typeof window === "undefined") return undefined
  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${id}`)
    return raw ? (JSON.parse(raw) as LedgerTransaction) : undefined
  } catch {
    return undefined
  }
}
