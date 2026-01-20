"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import { Feature, Geometry, GeoJsonProperties } from "geojson"

import './page.css'
import 'mapbox-gl/dist/mapbox-gl.css'

import { loadRoutesFromCSV } from "../animation/loaders/loadRouteFromCsv"
import { loadShipLogsFromCSV } from "../animation/loaders/loadShipLogFromCsv"
import { SimulationClock } from "../animation/core/SimulationClock"
import { Vessel } from "../animation/entities/Vessel"
import { loadVesselDetailFromCSV } from "../animation/loaders/loadVesselDetailsFromCsv"
import { VesselDetail } from "../animation/entities/VesselDetail"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

export default function Home() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const clockRef = useRef<SimulationClock | null>(null)
  const [simTime, setSimTime] = useState<number>(0)
  const [simStart, setSimStart] = useState(0)
  const [simEnd, setSimEnd] = useState(1)
  const [speed, setSpeed] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)

  const vesselDetailsRef = useRef<Map<number, VesselDetail> | null>(null)
  type VesselState = {
      lng: number
      lat: number
      heading: number
    }

  const vesselPositions = useRef<Map<number, VesselState>>(new Map())

const updateVessels = (vessels: Vessel[], time: number) => {
  const map = mapRef.current
  if (!map) return

  // ======= Atualiza vesselPositions =======
  // Primeiro, remove os navios que já terminaram
  vesselPositions.current.forEach((_state, vesselId) => {
    const vessel = vessels.find(v => v.id === vesselId)
    if (!vessel) {
      vesselPositions.current.delete(vesselId)
      return
    }
    const lastExecEnd = Math.max(...vessel.executions.map(e => e.endTime))
    if (time > lastExecEnd) {
      vesselPositions.current.delete(vesselId)
    }
  })

  // Depois, atualiza os estados dos navios ativos
  vessels.forEach(vessel => {
    const state = vessel.getStateAt(time)
    if (!state) return
    vesselPositions.current.set(vessel.id, {
      lng: state.position.lng,
      lat: state.position.lat,
      heading: state.heading
    })
  })

  // ======= Features para os ícones =======
  const vesselFeatures: Feature<Geometry, GeoJsonProperties>[] = Array.from(
    vesselPositions.current.entries()
  ).map(([id, pos]) => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [pos.lng, pos.lat] },
    properties: { id, heading: pos.heading },
  }))

  const vesselSource = map.getSource("vessel") as mapboxgl.GeoJSONSource
  if (vesselSource) {
    vesselSource.setData({ type: "FeatureCollection", features: vesselFeatures })
  }

  // ======= Features para labels =======
  const labelFeatures: Feature<Geometry, GeoJsonProperties>[] = Array.from(
    vesselPositions.current.entries()
  ).map(([id, pos]) => {
    const detail = vesselDetailsRef.current?.get(id)
    return {
      type: "Feature",
      geometry: { type: "Point", coordinates: [pos.lng, pos.lat] },
      properties: {
        title: `Vessel ${id}`,
        subtitle: detail?.berth ?? "",
      },
    }
  })

  const labelSource = map.getSource("vessel-label") as mapboxgl.GeoJSONSource
  if (labelSource) {
    labelSource.setData({ type: "FeatureCollection", features: labelFeatures })
  }
}


  // ===============================
  // LOAD VESSEL INFO
  // ===============================
useEffect(() => {
  async function loadDetails() {
    const details = await loadVesselDetailFromCSV()
    vesselDetailsRef.current = details
  }

  loadDetails()
}, [])

  // ===============================
  // MAP INIT
  // ===============================
  useEffect(() => {
    
    if (!mapContainerRef.current) return
    if (mapRef.current) return

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-46.33, -23.95], // Porto de Santos
      zoom: 12,
    })

    mapRef.current = map

map.on("load", () => {
  // ===============================
  // SOURCE - VESSELS
  // ===============================
  map.addSource("vessel", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  })

    // ===============================
    // LOAD VESSEL IMAGE
    // ===============================
    map.loadImage("/image/vessel.png", (error, image) => {
      if (error || !image) {
        console.error("Erro ao carregar vessel.png", error)
        return
      }

      if (!map.hasImage("vessel-icon")) {
        map.addImage("vessel-icon", image)
      }

      // ===============================
      // VESSEL ICON LAYER
      // ===============================
      map.addLayer(
        {
        id: "vessel-layer",
        type: "symbol",
        source: "vessel",
        layout: {
          "icon-image": "vessel-icon",
          "icon-size": 0.02,
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "icon-anchor": "center",

          // 🔹 rotação baseada no heading
          "icon-rotate": ["get", "heading"],
          "icon-rotation-alignment": "map",

        },
      })

    }
  
  )

    // ===============================
    // LABEL SOURCE
    // ===============================
    map.addSource("vessel-label", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    })

    // ===============================
    // LABEL LAYER
    // ===============================
    map.addLayer({
      id: "vessel-label-layer",
      type: "symbol",
      source: "vessel-label",
      layout: {
        "text-field": [
          "format",
          ["get", "title"], { "font-scale": 1.0 },
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
        "text-halo-width": 10,   // 🔹 padding fake
        "text-halo-blur": 0.3,   // 🔹 bordas suaves
      },
    })
  })

  }, [])

  // ===============================
  // SIMULATION
  // ===============================
  useEffect(() => {
    async function setupSimulation() {
      const routes = await loadRoutesFromCSV()
      const executions = await loadShipLogsFromCSV(routes)

      console.log(executions)
      const vesselsMap = new Map<number, Vessel>()

      executions.forEach((e) => {
        if (!vesselsMap.has(e.vesselId)) {
          vesselsMap.set(e.vesselId, new Vessel(e.vesselId, []))
        }
        vesselsMap.get(e.vesselId)!.executions.push(e)
      })

      const vessels = Array.from(vesselsMap.values())

      const start = Math.min(...executions.map(e => e.startTime))
      const end = Math.max(...executions.map(e => e.endTime))

      setSimStart(start)
      setSimEnd(end)
      setSimTime(start)

      const clock = new SimulationClock(start, end)
      clockRef.current = clock

      clock.onTick((time) => {
        setSimTime(time)
        vessels.forEach((vessel) => {
          const currentTime = clockRef.current!.getTime()
          const state = vessel.getStateAt(time)
          if (!state) return
          updateVessels(vessels, time)
        })
      })
    }

    setupSimulation()
  }, [])


  const increaseSpeed = () => {
    setSpeed((prev) => {
      const next = Math.min(prev + 0.5, 4)
      clockRef.current?.setSpeed(next)
      return next
    })
  }

  const decreaseSpeed = () => {
    setSpeed((prev) => {
      const next = Math.max(prev - 0.5, 0.5)
      clockRef.current?.setSpeed(next)
      return next
    })
  }


  // ===============================
  // UI
  // ===============================

  return (
<div style={{ position: "relative", height: "100vh" }}>
  <div ref={mapContainerRef} className="map-container" />

  <div className="controls">


<div className="buttons">
  <button
    onClick={() => {
      if (isPlaying) {
        clockRef.current?.pause()
        setIsPlaying(false)
      } else {
        clockRef.current?.play()
        setIsPlaying(true)
      }
    }}
    className={isPlaying ? "btn-pause" : "btn-play"}
  >
    {isPlaying ? "⏸ Pause" : "▶ Play"}
  </button>
</div>

    
  <div className="speed-control">
    <button onClick={decreaseSpeed}> ➖ </button>

    <span className="speed-value">
      {speed.toFixed(1)}x
    </span>

    <button onClick={increaseSpeed}> ➕ </button>
  </div>


    <input
      type="range"
      min={simStart}
      max={simEnd}
      value={simTime}
      onChange={(e) => {
        const t = Number(e.target.value)
        setSimTime(t)
        clockRef.current?.seek(t)
      }}
    />

    <div className="time-display">
      ⏱ {formatTime(simTime)}
    </div>
  </div>
</div>


    
  )
}

// ===============================
// UPDATE VESSEL
// ===============================


function updateVessel(
  map: mapboxgl.Map | null,
  lng: number,
  lat: number,
  heading: number
) {
  if (!map) return
  const source = map.getSource("vessel") as mapboxgl.GeoJSONSource
  if (!source) return

  source.setData({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        properties: {},
      },
    ],
  })
}

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}


