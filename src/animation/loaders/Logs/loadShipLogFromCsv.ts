import Papa from "papaparse"
import { VesselRouteExecution } from "../../entities/VesselRouteExecution"
import { Route } from "../../entities/Route"
import { loadManeuverLog } from "./loadManeuverLogFromCsv"
import { loadDefManeuvers } from "../Defs/loadManeuverDefFromCsv"

type ShipLogRow = {
  vessel_id: string
  route_id: string
  start_time: string
  end_time: string
  forward: string
}

export async function loadShipLogsFromCSV(
  routes: Map<number, Route>

): Promise<VesselRouteExecution[]> {
  const res = await fetch("/data/Logs/ship_log_V02.csv")
  const text = await res.text()

  const parsed = Papa.parse<ShipLogRow>(text, {
    header: true,
    delimiter: ";",
    skipEmptyLines: true,
  })

  const executions: VesselRouteExecution[] = []
  const maneuverLog = await loadManeuverLog()
  const maneuverDef = await loadDefManeuvers()


  parsed.data.forEach(async (row) => {
    
    const vesselId = Number(row.vessel_id)
    const routeId = Number(row.route_id)
    const startTime = Number(row.start_time) * 1000
    const endTime = Number(row.end_time) * 1000
    const forward = row.forward === "1" // a coluna nova do CSV


    const route = routes.get(routeId)
    if (!route) {
      console.warn("Route not found:", routeId)
      return
    }

    const execution = new VesselRouteExecution(
        vesselId,
        route,
        startTime,
        endTime,
        forward,
      )
    
    if (route.berthRoute) {

      const maneuver_id = maneuverLog.find(m => m.vesselId === vesselId)

      const maneuver = maneuverDef.get(Number(maneuver_id?.maneuverId))
      execution.maneuver = [Number(maneuver?.dock_angle), Number(maneuver?.undock_angle)]
    }

  executions.push(execution)

  })

  return executions
}
