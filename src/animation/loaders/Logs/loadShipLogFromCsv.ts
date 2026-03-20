import Papa from "papaparse"
import { ExecutionType, VesselRouteExecution } from "../../entities/VesselRouteExecution"
import { Route } from "../../entities/Route"
import { loadManeuverLog } from "./loadManeuverLogFromCsv"
import { loadDefManeuvers } from "../Defs/loadManeuverDefFromCsv"
import { Console } from "console"
import { ScenarioConfig } from "../../entities/scenario_infos"

type ShipLogRow = {
  ARRIVAL_ID: string
  ROUTE_ID: string
  START_TIME: string
  END_TIME: string
  FORWARD: string
}

export async function loadShipLogsFromCSV(
  scenario: ScenarioConfig,
  routes: Map<number, Route>

): Promise<VesselRouteExecution[]> {
  const file = "/data/Scenarios/" + scenario.id + "/animation_movements.csv"
  const res = await fetch(file)
  const text = await res.text()

  const parsed = Papa.parse<ShipLogRow>(text, {
    header: true,
    delimiter: ";",
    skipEmptyLines: true,
  })

  const executions: VesselRouteExecution[] = []
  const maneuverLog = await loadManeuverLog(scenario.id)
  const maneuverDef = await loadDefManeuvers()

const vesselMap = new Map<number, ShipLogRow[]>()

  // 1️⃣ Agrupa linhas por vessel
  parsed.data.forEach((row) => {
    const vesselId = Number(row.ARRIVAL_ID)

    if (!vesselMap.has(vesselId)) {
      vesselMap.set(vesselId, [])
    }

    vesselMap.get(vesselId)!.push(row)
  })

  const START_MINUTES =
    (scenario.startFilterDate.getTime() - scenario.endFilterDate.getTime()) / 60000
  
  const END_MINUTES =
    (scenario.endFilterDate.getTime() - scenario.startFilterDate.getTime()) / 60000

  const startLimit = START_MINUTES
  const endLimit = END_MINUTES


  // 2️⃣ Processa vessel por vessel
  vesselMap.forEach((rows, vesselId) => {

    // encontra firstEx e lastEx só olhando o CSV
    const firstRow = rows.find(r =>
      Number(r.ROUTE_ID) === 1 && r.FORWARD === "1"
    )

    const lastRow = rows.find(r =>
      Number(r.ROUTE_ID) === 1 && r.FORWARD === "0"
    )

    if (!firstRow) return

    const enterMinute = Number(firstRow.START_TIME)
    const exitMinute = lastRow
      ? Number(lastRow.END_TIME)
      : Number.MAX_SAFE_INTEGER

    // 🔥 FILTRO AQUI (antes de criar objetos pesados)
    const intersects =
      exitMinute >= startLimit &&
      enterMinute <= endLimit

    if(intersects)
      // console.log(startLimit, endLimit, enterMinute, exitMinute)

    if (!intersects) {
      // console.log("!intersects")
      return
    }

    // 3️⃣ Só agora cria executions
    rows.forEach((row) => {

      const routeId = Number(row.ROUTE_ID)
      const route = routes.get(routeId)
      if (!route) return

      const startTime = Number(row.START_TIME) * 1000
      const endTime = Number(row.END_TIME) * 1000
      const forward = row.FORWARD === "1"

      const type =
        routeId === 0
          ? ExecutionType.QUEUE
          : ExecutionType.MOVE

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
        execution.maneuver = [
          Number(maneuver?.dock_angle),
          Number(maneuver?.undock_angle)
        ]
      }

      executions.push(execution)
    })
  })

  executions.sort((a, b) => a.startTime - b.startTime)

  return executions
}
