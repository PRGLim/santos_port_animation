"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"

import './page.css'
import 'mapbox-gl/dist/mapbox-gl.css'

import { loadVesselDetailFromCSV } from "../animation/loaders/loadVesselDetailsFromCsv"
import { VesselDetail } from "../animation/entities/VesselDetail"
import { updateVessels } from "../animation/services/updateVesselForMap"
import MapView from "../components/map/mapView"
import { SpeedControl } from "../components/controls/speedControl"
import { BottomControl } from "../components/controls/timeSlider"
import { SimulationController } from "../animation/core/SimulationController"
import VesselPanel from "../components/vessel_panel/vesselPanel"
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

export default function Home() {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const simRef = useRef<SimulationController | null>(null)
  

  const [simTime, setSimTime] = useState<number>(0)
  const [simStart, setSimStart] = useState(0)
  const [simEnd, setSimEnd] = useState(1)
  const [speed, setSpeed] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedVesselId, setSelectedVesselId] = useState<number | null>(null)



  const vesselDetailsRef = useRef<Map<number, VesselDetail> | null>(null)

  type VesselState = {
      lng: number
      lat: number
      heading: number
    }

  const vesselPositions = useRef<Map<number, VesselState>>(new Map())


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
  // SIMULATION
  // ===============================
useEffect(() => {
  async function setup() {
    const sim = new SimulationController()
    await sim.init()
    simRef.current = sim

    setSimStart(sim.startTime)
    setSimEnd(sim.endTime)
    setSimTime(sim.startTime)

    sim.onTick((time, vessels) => {
      setSimTime(time)

      if (!mapRef.current) return

      updateVessels(
        mapRef.current,
        vessels,
        time,
        vesselPositions.current,
        vesselDetailsRef.current ?? undefined
      )
    })
  }

  setup()
}, [])


  const increaseSpeed = () => {
    setSpeed((prev) => {
      const next = Math.min(prev + 0.5, 4)
      simRef.current?.setSpeed(next)
      return next
    })
  }

  const decreaseSpeed = () => {
    setSpeed((prev) => {
      const next = Math.max(prev - 0.5, 0.5)
      simRef.current?.setSpeed(next)
      return next
    })
  }


  // ===============================
  // UI
  // ===============================

  return (

<div className="map-wrapper">

  <MapView
    onMapReady={(map) => {
      mapRef.current = map
    }}
    selectedVesselId={selectedVesselId}
    onVesselSelect={setSelectedVesselId}
  />


  { selectedVesselId &&
    <VesselPanel
      vessel={vesselDetailsRef.current?.get(Number(selectedVesselId)) ?? null}
      onClose={() => setSelectedVesselId(null)}
      currentTime={simTime}/>
  }

  {/* (speed control) */}
  <div className="controls-top">

    <SpeedControl
      speed={speed}
      onIncrease={increaseSpeed}
      onDecrease={decreaseSpeed}
    />
  </div>

  {/* (bottom controls) */}
  <BottomControl
    isPlaying={isPlaying}
    onToggle={() => {
      if (isPlaying) simRef.current?.pause()
      else simRef.current?.play()
      setIsPlaying(!isPlaying)
    }}
    time={simTime}
    min={simStart}
    max={simEnd}
    onChange={(t) => {
      setSimTime(t)
      simRef.current?.seek(t)
    }}
  />
</div>

  )
}


