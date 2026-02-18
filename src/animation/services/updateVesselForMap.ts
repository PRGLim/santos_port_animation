// animation/map/updateVessels.ts
import { Feature, Geometry, GeoJsonProperties } from "geojson"
import { Vessel } from "../entities/Vessel"
import { VesselDetail } from "../entities/VesselDetail"
import { VesselStatus } from "../types/vesselStatus"

type VesselState = {
  lng: number
  lat: number
  heading: number
}

const EPS = 1e-7


// not using
function hasChanges(a: VesselState, b: VesselState) {
  return (
    Math.abs(a.lng - b.lng) > EPS ||
    Math.abs(a.lat - b.lat) > EPS ||
    Math.abs(a.heading - b.heading) > 0.1
  )
}


export function updateVessels(
  map: mapboxgl.Map,
  vessels: Vessel[],
  time: number,
  vesselPositions: Map<number, VesselState>,
  vesselDetails?: Map<number, VesselDetail>
) {

  let updateNeeded = true 

  const queue = vessels
    .map(v => ({
      vessel: v,
      state: v.getStateAt(time)
    }))
    .filter(e => e.state?.status === VesselStatus.IN_QUEUE)

    queue.sort((a, b) => 
      a.vessel.executions[0].startTime -
      b.vessel.executions[0].startTime
    )
  //Remove navios finalizados
  vesselPositions.forEach((_state, vesselId) => {
    
    const vessel = vessels.find(v => v.id === vesselId)
    if (!vessel) {
      vesselPositions.delete(vesselId)
      updateNeeded = true
      return
    }

    const lastExecEnd = Math.max(...vessel.executions.map(e => e.endTime))
    if (time > lastExecEnd) {
      if(vessel.id == 360)
        console.log("LAST EX:", vessel.id)

      vesselPositions.delete(vesselId)
      updateNeeded = true
    }
  })

  // Atualiza estados
  vessels.forEach(vessel => {


    if (vessel.isFinished(time)) {
      vesselPositions.delete(vessel.id)
      return
    }

    const detail = vesselDetails?.get(vessel.id)
    const state = vessel.getStateAt(time)

    if (state) {
      detail?.setStatus(state.status)
    }

    if (!state){
      vesselPositions.delete(vessel.id)
      return
    } 

    const prev = vesselPositions.get(vessel.id)

    const next: VesselState = {
      lng: state.position.lng,
      lat: state.position.lat,
      heading: state.heading
    }

    if (!prev || hasChanges(prev, next)){
      vesselPositions.set(vessel.id, next)
      updateNeeded = true
    }

    if (!updateNeeded) return

  })


  queue.forEach((entry, index) => {
    const { vessel, state } = entry
    if (!state) return

    // projeta a posição base
    const p = map.project([state.position.lng, state.position.lat])

    // deslocamento simples da fila
    p.x += index * 30

    // volta pra lng/lat
    const newPos = map.unproject(p)

    const nextWithOffset: VesselState = {
      lng: newPos.lng,
      lat: newPos.lat,
      heading: state.heading
    }

    vesselPositions.set(vessel.id, nextWithOffset)
  })

  const vesselDetailsMap = new Map<number, VesselDetail>()


  // Vessel Image 
  const vesselFeatures: Feature<Geometry, GeoJsonProperties>[] =
    Array.from(vesselPositions.entries()).map(([id, pos]) => (
      {
      type: "Feature",
      geometry: { type: "Point", coordinates: [pos.lng, pos.lat] },
      properties: { 
        id, 
        heading: pos.heading,
        market: vesselDetails?.get(id)?.vessel_market_category
      },
    }
  ))

  const vesselSource = map.getSource("vessel") as mapboxgl.GeoJSONSource
  vesselSource?.setData({
    type: "FeatureCollection",
    features: vesselFeatures,
  })

  //Labels
  const labelFeatures: Feature<Geometry, GeoJsonProperties>[] =
    Array.from(vesselPositions.entries()).map(([id, pos]) => {
      const detail = vesselDetails?.get(id)
      return {
        type: "Feature",
        geometry: { type: "Point", coordinates: [pos.lng, pos.lat] },
        properties: {
          title: `Vessel ${id}`,
          subtitle: detail?.vessel_berth ?? "",
        },
      }
    })

  const labelSource = map.getSource("vessel-label") as mapboxgl.GeoJSONSource
  labelSource?.setData({
    type: "FeatureCollection",
    features: labelFeatures,
  })
}
