"use client"

import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

type Props = {
  onMapReady?: (map: mapboxgl.Map) => void
}

export default function MapView({ onMapReady }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-46.33, -23.95],
      zoom: 12,
    })

    mapRef.current = map

    map.on("load", () => {
      // ===== Sources =====
      map.addSource("vessel", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      })

      map.addSource("vessel-label", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      })

      // ===== Image =====
      map.loadImage("/image/vessel.png", (err, image) => {
        if (err || !image) return
        if (!map.hasImage("vessel-icon")) {
          map.addImage("vessel-icon", image)
        }

        map.addLayer({
          id: "vessel-layer",
          type: "symbol",
          source: "vessel",
          layout: {
            "icon-image": "vessel-icon",
            "icon-size": 0.02,
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            "icon-rotate": ["get", "heading"],
            "icon-rotation-alignment": "map",
          },
        })
      })

      map.addLayer({
        id: "vessel-label-layer",
        type: "symbol",
        source: "vessel-label",
        layout: {
          "text-field": [
            "format",
            ["get", "title"], { "font-scale": 1 },
            "\n", {},
            ["get", "subtitle"], { "font-scale": 0.85 },
          ],
          "text-size": 14,
          "text-offset": [0, 1.6],
          "text-anchor": "top",
          "text-allow-overlap": true,
        },
        paint: {
          "text-color": "#000",
          "text-halo-color": "rgba(255,255,255,0.8)",
          "text-halo-width": 10,
          "text-halo-blur": 0.3,
        },
      })

      onMapReady?.(map)
    })
  }, [])

  return <div ref={containerRef} className="map-container" />
}
