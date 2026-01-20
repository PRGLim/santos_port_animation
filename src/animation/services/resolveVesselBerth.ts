import { loadDefManeuvers } from "../loaders/loadManeuverDefFromCsv"
import { loadManeuverLog } from "../loaders/loadManeuverLogFromCsv"

export async function resolveVesselBerths(): Promise<Map<number, string>> {
  const [maneuverDefs, maneuverLogs] = await Promise.all([
    loadDefManeuvers(),
    loadManeuverLog(),
  ])

  const vesselToBerth = new Map<number, string>()

  maneuverLogs.forEach(log => {
    const def = maneuverDefs.get(log.maneuverId)
    if (!def) return

    if (!vesselToBerth.has(log.vesselId)) {
      vesselToBerth.set(log.vesselId, def.berth)
    }
  })

  return vesselToBerth
}
