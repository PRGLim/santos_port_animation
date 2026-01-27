import Papa from "papaparse"
import { SCENARIO } from "../../core/constants"

type ManeuverLogRow = {
  ARRIVAL_ID: string
  MANEUVER_ID: string
}

export async function loadManeuverLog(): Promise<{ vesselId: number, maneuverId: number }[]> {
  const file = "/data/Logs/animation_maneuver_log" + SCENARIO + ".csv"
  const res = await fetch(file)
  const text = await res.text()

  const parsed = Papa.parse<ManeuverLogRow>(text, {
    header: true,
    delimiter: ";",
    skipEmptyLines: true,
  })

  return parsed.data.map(row => ({
    vesselId: Number(row.ARRIVAL_ID),
    maneuverId: Number(row.MANEUVER_ID)
  }))
}
