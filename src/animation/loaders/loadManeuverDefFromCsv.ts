import Papa from "papaparse"

type DefManeuverRow = {
  maneuver_id: string
  berth: string
  type: string
  dock_angle: string
  undock_angle: string
}

export async function loadDefManeuvers(): Promise<Map<number, {dock_angle: string, undock_angle: string, berth: string}>> {
  const res = await fetch("/data/def_maneuver.csv")
  const text = await res.text()

  const parsed = Papa.parse<DefManeuverRow>(text, { header: true, skipEmptyLines: true })

  const map = new Map<number, {dock_angle: string, undock_angle: string, berth: string}>()
  parsed.data.forEach(row => {
    const maneuver_id = Number(row.maneuver_id)

    map.set(maneuver_id, {
      dock_angle: row.dock_angle,
      undock_angle: row.undock_angle,
      berth: row.berth
    })
})

  return map
}
