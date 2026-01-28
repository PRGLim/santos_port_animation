"use client"

import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

type Props = {
  onMapReady?: (map: mapboxgl.Map) => void
  onVesselSelect?: (id: number) => void
  onSegSelect?: (id: string) => void
  selectedVesselId?: number | null
  selectedSegId?: string | null
}

export default function MapView({ onMapReady, onVesselSelect, onSegSelect, selectedSegId, selectedVesselId }: Props) {
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

    // When loaded
    map.on("load", () => {
      // ===== Sources =====

      map.addSource("canal", {
        type: "geojson",
        data: "/data/Polygon/canal.geojson",
      })

      map.addSource("vessel", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      })

      map.addSource("vessel-label", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      })

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
          }
        })
      })

      // ===== Layers =====
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

      // segments
      map.addLayer(
      {
        id: "canal-polygon",
        type: "fill",
        source: "canal",
        paint: {
          "fill-color": "#8962B8",
          "fill-opacity": 0.4,
        },
      },
      "waterway-label" // camada existente
      )

      // VESSEL CHANGE COLOR WHEN SELECTED 
      map.addLayer({
          id: "vessel-selected",
          type: "symbol",
          source: "vessel",
          filter: ["==", ["get", "id"], -1],
          layout: {
            "icon-image": "vessel-icon",
            "icon-size": 0.02,
            "icon-rotate": ["get", "heading"],
            
          },
          paint: {
            "icon-color": "#000000",
            "icon-opacity": 0.3
          }

      })
      
      // CHANGE SEGMENT COLOR WHEN SELECTED 
      map.addLayer({
        id: "canal-selected",
        type: "fill",
        source: "canal",
        paint: {
          "fill-color": "#FF5722",
          "fill-opacity": 0.7,
        },
      })

    onMapReady?.(map)
    })


    map.on("mouseenter", "vessel-layer", () => {
      map.getCanvas().style.cursor = "pointer"
    })

    map.on("mouseleave", "vessel-layer", () => {
      map.getCanvas().style.cursor = ""
    })

    map.on("mouseenter", "canal-polygon", () => {
      map.getCanvas().style.cursor = "pointer"
    })

    map.on("mouseleave", "canal-polygon", () => {
      map.getCanvas().style.cursor = ""
    })

    // When segment clicked
    map.on("click", "canal-polygon", (s) => {
      const id = s.features?.[0]?.properties?.id
      onSegSelect?.(id)
      console.log(id)
    })

    // When vessel clicked
    map.on("click", "vessel-layer", (e) => {
      const id = Number(e.features?.[0]?.properties?.id)
      onVesselSelect?.(id)
    })





  }, [])


  // VESSEL
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // função 
    const updateSelectedVessel = () => {
      if (!map.getLayer("vessel-selected")) return

      map.setFilter("vessel-selected", [
        "==",
        ["get", "id"],
        selectedVesselId ?? -1,
      ])
    }

    // se o style já carregou
    if (map.isStyleLoaded()) {
      updateSelectedVessel()
    } else {
      // espera carregar
      map.once("load", updateSelectedVessel)
    }
  }, [selectedVesselId])

  // SEGMENT
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const update = () => {
      if (!map.getLayer("canal-selected")) return

      map.setFilter("canal-selected", [
        "==",
        ["get", "id"],
        selectedSegId ?? -1,
      ])
    }

    if (map.isStyleLoaded()) update()
    map.on("load", update)

    return () => {
      map.off("load", update)
    }
  }, [selectedSegId])



  return <div ref={containerRef} className="map-container" />
}
