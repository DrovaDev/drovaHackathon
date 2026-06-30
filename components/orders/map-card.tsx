"use client"

import { useEffect, useRef } from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

type Props = {
  pickupAddress: string
  deliveryAddress: string
  pickupCoords?: [number, number]
  deliveryCoords?: [number, number]
}

const DEFAULT_PICKUP: [number, number] = [7.4913, 9.0579] // Abuja, Wuse II
const DEFAULT_DELIVERY: [number, number] = [7.4966, 9.0595] // Abuja, Maitama

export function MapCard({ pickupAddress, deliveryAddress, pickupCoords, deliveryCoords }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)

  const pickup = pickupCoords || DEFAULT_PICKUP
  const delivery = deliveryCoords || DEFAULT_DELIVERY

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

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
      center: [
        (pickup[0] + delivery[0]) / 2,
        (pickup[1] + delivery[1]) / 2,
      ],
      zoom: 14,
      attributionControl: false,
    })

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right")

    const pickupEl = document.createElement("div")
    pickupEl.className = "pickup-marker"
    pickupEl.innerHTML = `
      <div style="
        width: 32px; height: 32px;
        background: var(--primary);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        border: 3px solid white;
      ">
        <span style="transform: rotate(45deg); color: white; font-size: 14px;">&#9654;</span>
      </div>
    `

    const deliveryEl = document.createElement("div")
    deliveryEl.className = "delivery-marker"
    deliveryEl.innerHTML = `
      <div style="
        width: 32px; height: 32px;
        background: var(--secondary);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        border: 3px solid white;
      ">
        <span style="transform: rotate(45deg); color: white; font-size: 14px;">&#9873;</span>
      </div>
    `

    new maplibregl.Marker({ element: pickupEl })
      .setLngLat(pickup)
      .setPopup(
        new maplibregl.Popup({ offset: 25 }).setHTML(
          `<div style="padding:4px 8px;font-size:12px;font-weight:600;">Pickup: ${pickupAddress}</div>`
        )
      )
      .addTo(map)

    new maplibregl.Marker({ element: deliveryEl })
      .setLngLat(delivery)
      .setPopup(
        new maplibregl.Popup({ offset: 25 }).setHTML(
          `<div style="padding:4px 8px;font-size:12px;font-weight:600;">Delivery: ${deliveryAddress}</div>`
        )
      )
      .addTo(map)

    const bounds = new maplibregl.LngLatBounds()
    bounds.extend(pickup)
    bounds.extend(delivery)
    map.fitBounds(bounds, { padding: 60 })

    map.on("load", () => {
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [pickup, delivery],
          },
          properties: {},
        },
      })
      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#256d00",
          "line-width": 3,
          "line-dasharray": [2, 2],
        },
      })
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [pickup, delivery, pickupAddress, deliveryAddress])

  return (
    <div className="bg-popover rounded-xl overflow-hidden relative shadow-sm border border-border h-[300px] lg:h-[360px]">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none gap-3 z-10">
        <div className="bg-popover/95 backdrop-blur-md p-3 rounded-xl pointer-events-auto flex items-center space-x-3 shadow-sm border border-border flex-1 min-w-0">
          <div className="bg-primary/10 p-2 rounded-lg shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11l19-9-9 19-2-8-8-2z"/>
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-[9px] uppercase font-bold text-muted-foreground/60 tracking-wider">Pickup</p>
            <p className="text-xs font-bold text-primary truncate">{pickupAddress}</p>
          </div>
        </div>
        <div className="bg-popover/95 backdrop-blur-md p-3 rounded-xl pointer-events-auto flex items-center space-x-3 shadow-sm border border-border flex-1 min-w-0">
          <div className="bg-secondary/10 p-2 rounded-lg shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
              <line x1="4" y1="22" x2="4" y2="15"/>
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-[9px] uppercase font-bold text-muted-foreground/60 tracking-wider">Delivery</p>
            <p className="text-xs font-bold text-primary truncate">{deliveryAddress}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
