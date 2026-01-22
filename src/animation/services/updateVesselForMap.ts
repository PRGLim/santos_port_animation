// animation/map/updateVessels.ts
import mapboxgl from "mapbox-gl"
import { Feature, Geometry, GeoJsonProperties } from "geojson"
import { Vessel } from "../entities/Vessel"
import { VesselDetail } from "../entities/VesselDetail"

type VesselState = {
  lng: number
  lat: number
  heading: number
}


const EPS = 1e-7

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

  let updateNeeded = false 


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
      vesselPositions.delete(vesselId)
      updateNeeded = true
    }
  })

  // Atualiza estados
  vessels.forEach(vessel => {

    const state = vessel.getStateAt(time)
    if (!state) return

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

    // vesselPositions.set(vessel.id, {
    //   lng: state.position.lng,
    //   lat: state.position.lat,
    //   heading: state.heading,
    // })
  })


  // Vessel Image 
  const vesselFeatures: Feature<Geometry, GeoJsonProperties>[] =
    Array.from(vesselPositions.entries()).map(([id, pos]) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [pos.lng, pos.lat] },
      properties: { id, heading: pos.heading },
    }))

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
          subtitle: detail?.berth ?? "",
        },
      }
    })

  const labelSource = map.getSource("vessel-label") as mapboxgl.GeoJSONSource
  labelSource?.setData({
    type: "FeatureCollection",
    features: labelFeatures,
  })
}
