import Papa from "papaparse"

type ManeuverLogRow = {
  ARRIVAL_ID: string
  MANEUVER_ID: string
}

export async function loadManeuverLog(): Promise<{ vesselId: number, maneuverId: number }[]> {
  const res = await fetch("/data/Logs/animation_maneuver_log.csv")
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
