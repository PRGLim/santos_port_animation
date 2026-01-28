import Papa from "papaparse"
import { ExecutionType, VesselRouteExecution } from "../../entities/VesselRouteExecution"
import { Route } from "../../entities/Route"
import { loadManeuverLog } from "./loadManeuverLogFromCsv"
import { loadDefManeuvers } from "../Defs/loadManeuverDefFromCsv"
import { SCENARIO } from "../../core/constants"

type ShipLogRow = {
  ARRIVAL_ID: string
  ROUTE_ID: string
  START_TIME: string
  END_TIME: string
  FORWARD: string
}

export async function loadShipLogsFromCSV(
  routes: Map<number, Route>

): Promise<VesselRouteExecution[]> {
  const file = "/data/Logs/animation_movements" + SCENARIO + ".csv"
  const res = await fetch(file)
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

    const vesselId = Number(row.ARRIVAL_ID)
    const routeId = Number(row.ROUTE_ID)
    const startTime = Number(row.START_TIME) * 1000
    const endTime = Number(row.END_TIME) * 1000
    const forward = row.FORWARD === "1" // a coluna nova do CSV
    let type: ExecutionType

    if (routeId === 0) {
      type = ExecutionType.QUEUE
    } else if (routeId > 16) {
      type = ExecutionType.BERTH
    } else {
      type = ExecutionType.MOVE
    }


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
        type,
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
