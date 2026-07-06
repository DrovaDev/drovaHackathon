"use client"

import { useEffect, useRef, useState } from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { Input } from "@/components/ui/input"
import { useDebouncedValue } from "@/hooks/use-debounced-value"

export type AddressPickerValue = {
  address: string
  longitude: number | null
  latitude: number | null
}

export type AddressPickerChange = AddressPickerValue & {
  city?: string
  state?: string
}

type NominatimAddress = {
  city?: string
  town?: string
  village?: string
  county?: string
  state?: string
}

type NominatimResult = {
  display_name: string
  lat: string
  lon: string
  address?: NominatimAddress
}

type Props = {
  markerColor?: "primary" | "secondary"
  placeholder?: string
  value: AddressPickerValue
  onChange: (next: AddressPickerChange) => void
}

// Matches components/orders/map-card.tsx's default (Abuja, Wuse II) for visual consistency.
const DEFAULT_CENTER: [number, number] = [7.4913, 9.0579]

function extractCityState(address?: NominatimAddress) {
  if (!address) return {}
  return {
    city: address.city || address.town || address.village || address.county,
    state: address.state,
  }
}

export function AddressMapPicker({ markerColor = "primary", placeholder, value, onChange }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markerRef = useRef<maplibregl.Marker | null>(null)
  const onChangeRef = useRef(onChange)
  const queryRef = useRef(value.address)

  const [query, setQuery] = useState(value.address)
  const [results, setResults] = useState<NominatimResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const debouncedQuery = useDebouncedValue(query, 500)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    queryRef.current = query
  }, [query])

  useEffect(() => {
    setQuery(value.address)
  }, [value.address])

  // Initialize the map once; live position sync happens in the effect below and via refs above
  // so this intentionally does not depend on `value`/`onChange`/`markerColor`.
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    const center: [number, number] =
      value.longitude !== null && value.latitude !== null ? [value.longitude, value.latitude] : DEFAULT_CENTER

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
          },
        ],
      },
      center,
      zoom: 13,
      attributionControl: false,
    })
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right")

    const el = document.createElement("div")
    el.innerHTML = `
      <div style="
        width: 26px; height: 26px;
        background: var(--${markerColor});
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        border: 3px solid white;
      "></div>
    `

    const marker = new maplibregl.Marker({ element: el, draggable: true }).setLngLat(center).addTo(map)
    markerRef.current = marker

    const reverseGeocode = async (lng: number, lat: number) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lon=${lng}&lat=${lat}`,
        )
        const data = await res.json()
        const address = typeof data?.display_name === "string" ? data.display_name : queryRef.current
        setQuery(address)
        onChangeRef.current({ address, longitude: lng, latitude: lat, ...extractCityState(data?.address) })
      } catch {
        onChangeRef.current({ address: queryRef.current, longitude: lng, latitude: lat })
      }
    }

    marker.on("dragend", () => {
      const { lng, lat } = marker.getLngLat()
      reverseGeocode(lng, lat)
    })

    map.on("click", (e) => {
      marker.setLngLat(e.lngLat)
      reverseGeocode(e.lngLat.lng, e.lngLat.lat)
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep the marker/map in sync when the value changes externally (e.g. form reset).
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return
    if (value.longitude === null || value.latitude === null) return
    const current = markerRef.current.getLngLat()
    if (current.lng === value.longitude && current.lat === value.latitude) return
    markerRef.current.setLngLat([value.longitude, value.latitude])
    mapRef.current.flyTo({ center: [value.longitude, value.latitude], zoom: 15 })
  }, [value.longitude, value.latitude])

  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery === value.address) {
      setResults([])
      return
    }
    let cancelled = false
    setIsSearching(true)
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=ng&q=${encodeURIComponent(debouncedQuery)}`,
    )
      .then((res) => res.json())
      .then((data: NominatimResult[]) => {
        if (cancelled) return
        setResults(Array.isArray(data) ? data : [])
        setShowResults(true)
      })
      .catch(() => {
        if (!cancelled) setResults([])
      })
      .finally(() => {
        if (!cancelled) setIsSearching(false)
      })
    return () => {
      cancelled = true
    }
  }, [debouncedQuery, value.address])

  const applySelection = (result: NominatimResult) => {
    const lng = Number(result.lon)
    const lat = Number(result.lat)
    setQuery(result.display_name)
    setShowResults(false)
    setResults([])
    mapRef.current?.flyTo({ center: [lng, lat], zoom: 15 })
    markerRef.current?.setLngLat([lng, lat])
    onChange({ address: result.display_name, longitude: lng, latitude: lat, ...extractCityState(result.address) })
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowResults(true)
          }}
          onFocus={() => {
            if (results.length > 0) setShowResults(true)
          }}
          placeholder={placeholder ?? "Search for an address..."}
          className="bg-silver-two border-0"
        />
        {showResults && (results.length > 0 || isSearching) && (
          <div className="absolute z-20 mt-1 w-full bg-popover border border-border rounded-lg shadow-lg max-h-52 overflow-y-auto">
            {isSearching && <p className="px-3 py-2 text-xs text-muted-foreground">Searching...</p>}
            {!isSearching &&
              results.map((result, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applySelection(result)}
                  className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-silver-two transition-colors"
                >
                  {result.display_name}
                </button>
              ))}
          </div>
        )}
      </div>
      <div className="h-40 rounded-lg overflow-hidden border border-border">
        <div ref={mapContainer} className="w-full h-full" />
      </div>
      <p className="text-[10px] text-muted-foreground">Click the map or drag the pin to fine-tune the location.</p>
    </div>
  )
}
