import Papa from "papaparse"

type DefManeuverRow = {
  MANEUVER_ID: string
  BERTH: string
  TYPE: string
  DOCK_ANGLE: string
  UNDOCK_ANGLE: string
}

export async function loadDefManeuvers(): Promise<Map<number, {dock_angle: string, undock_angle: string, berth: string}>> {
  const res = await fetch("/data/Defs/def_maneuvers.csv")
  const text = await res.text()

    
  const parsed = Papa.parse<DefManeuverRow>(text, { header: true, delimiter: ";", skipEmptyLines: true,  })

  const map = new Map<number, {dock_angle: string, undock_angle: string, berth: string}>()
  parsed.data.forEach(row => {
    const maneuver_id = Number(row.MANEUVER_ID)

    map.set(maneuver_id, {
      dock_angle: row.DOCK_ANGLE,
      undock_angle: row.UNDOCK_ANGLE,
      berth: row.BERTH
    })
})

  return map
}
