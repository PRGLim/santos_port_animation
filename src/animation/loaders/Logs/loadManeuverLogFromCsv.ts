import Papa from "papaparse"

type ManeuverLogRow = {
  vessel_id: string
  maneuver_id: string
}

export async function loadManeuverLog(): Promise<{ vesselId: number, maneuverId: number }[]> {
  const res = await fetch("/data/Logs/maneuvers_log.csv")
  const text = await res.text()

  const parsed = Papa.parse<ManeuverLogRow>(text, {
    header: true,
    skipEmptyLines: true,
  })

  return parsed.data.map(row => ({
    vesselId: Number(row.vessel_id),
    maneuverId: Number(row.maneuver_id)
  }))
}
