'use client'

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"

import './page.css'
import 'mapbox-gl/dist/mapbox-gl.css'

import { loadVesselDetailFromCSV } from "../animation/loaders/Defs/loadVesselDetailsFromCsv"
import { VesselDetail } from "../animation/entities/VesselDetail"
import { updateVessels } from "../animation/services/updateVesselForMap"
import MapView from "../components/map/mapView"
import { SpeedControl } from "../components/controls/speedControl"
import { BottomControl } from "../components/controls/timeSlider"
import { SimulationController } from "../animation/core/SimulationController"
import EnvironmentPanel from "../components/environment_panel/environmentPanel"
import { loadEnvFromCSV } from "../animation/loaders/Envinroment/loadEnvironmentFromCsv"
import { EnvSnapshot } from "../animation/entities/Environments/EnvTeste"
import { useEnvironment } from "../animation/services/useEnvironment"
import { SidePanelTabs } from "../components/lateralPanel"
import { useKPIS } from "../animation/services/useKPIS"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

export default function Home() {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const simRef = useRef<SimulationController | null>(null)
  const vesselPositions = useRef<Map<number, VesselState>>(new Map())
  const vesselDetailsRef = useRef<Map<number, VesselDetail> | null>(null)
  const kpis = useKPIS()

  const [simTime, setSimTime] = useState<number>(0)
  const [simStart, setSimStart] = useState(0)
  const [simEnd, setSimEnd] = useState(1)
  const [speed, setSpeed] = useState(10)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedVesselId, setSelectedVesselId] = useState<number | null>(null)
  const [selectedSegId, setSelectedSegId] = useState<string | null>(null)


  type EnvKey =
    | "tideHeight"
    | "current"
    | "visibility"
    | "waveFreq"
    | "waveHeight"
    | "windSpeed"

  type EnvState = Record<EnvKey, EnvSnapshot[]>

  const [envs, setEnvs] = useState<EnvState>({
    tideHeight: [],
    current: [],
    visibility: [],
    waveFreq: [],
    waveHeight: [],
    windSpeed: [],
  })

  const ENV_CONFIG: Record<EnvKey, string> = {
    tideHeight: "/data/Env/i_tide_height_log.csv",
    current: "/data/Env/i_current_data.csv",
    visibility: "/data/Env/i_visibility_log.csv",
    waveFreq: "/data/Env/i_wave_freq_log.csv",
    waveHeight: "/data/Env/i_wave_height_log.csv",
    windSpeed: "/data/Env/i_wind_speed_log.csv",
  }


  const { tideHeight, current, visibility, waveFreq, waveHeight, windSpeed } = useEnvironment(simTime, {
    tideHeight: envs.tideHeight,
    current: envs.current,
    visibility: envs.visibility,
    waveFreq: envs.waveFreq,
    waveHeight: envs.waveHeight,
    windSpeed: envs.windSpeed
  })


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

        kpis.update(vessels, time)
        
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

  // ===============================
  // LOAD ENVIRONMENT DATAS
  // ===============================

  useEffect(() => {
      
    if (!simStart || !simEnd) return

    const start = new Date("01/01/2025 06:00:00")
    const end = new Date("01/06/2025 00:00:00") // dia 06 de janeiro

    async function loadAllEnvs() {
      const entries = await Promise.all(
        Object.entries(ENV_CONFIG).map(async ([key, file]) => {
          const data = await loadEnvFromCSV(file, start.getTime(), end.getTime())
          return [key, data] as [EnvKey, EnvSnapshot[]]
        })
      )

      setEnvs(Object.fromEntries(entries) as EnvState)
    }

    loadAllEnvs()
  }, [simStart, simEnd])


  // ===============================
  // BUTTONS CONTROL FUNCTIONS
  // ===============================

  const increaseSpeed = () => {
    setSpeed((prev) => {
      const next = Math.min(prev + 0.5, 20)
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
          onSegSelect={setSelectedSegId}
          selectedSegId={selectedSegId}
        />

        <SidePanelTabs 
          selectedVessel={vesselDetailsRef.current?.get(Number(selectedVesselId)) ?? null}
          selectedSegment={selectedSegId} 
          onClosedSegment={() => setSelectedSegId(null)}
          currentTime={simTime}
          kpis={kpis}
          />

        <EnvironmentPanel 
          tideHeight={tideHeight} 
          current={current} 
          visibility={visibility} 
          waveFreq={waveFreq}
          waveHeight={waveHeight}
          windSpeed={windSpeed}
          /> 


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


