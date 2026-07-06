export interface StateOption {
  key: string
  value: string
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z]/g, "")
}

/**
 * Nominatim reports Abuja's state as "Federal Capital Territory" (OSM's official
 * tagging), which never matches our backend's canonical list by name — special-case it.
 */
function isAbujaLike(normalized: string): boolean {
  return normalized.includes("abuja") || normalized.includes("federalcapital") || normalized.includes("fct")
}

/**
 * Maps a free-text state name (e.g. from Nominatim geocoding) to the matching
 * entry in our backend's canonical states list, so it can be used as a Select value.
 * Returns undefined when no reasonable match is found.
 */
export function matchState(rawState: string | undefined | null, options: StateOption[]): string | undefined {
  if (!rawState || options.length === 0) return undefined
  const normalizedRaw = normalize(rawState)

  const exact = options.find((option) => normalize(option.value) === normalizedRaw)
  if (exact) return exact.value

  if (isAbujaLike(normalizedRaw)) {
    const fct = options.find((option) => isAbujaLike(normalize(option.value)))
    if (fct) return fct.value
  }

  const partial = options.find((option) => {
    const normalizedOption = normalize(option.value)
    return normalizedOption.includes(normalizedRaw) || normalizedRaw.includes(normalizedOption)
  })
  return partial?.value
}
