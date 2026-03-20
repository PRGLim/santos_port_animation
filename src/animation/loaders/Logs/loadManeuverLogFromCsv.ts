import Papa from "papaparse"

type ManeuverLogRow = {
  ARRIVAL_ID: string
  MANEUVER_ID: string
}

export async function loadManeuverLog(scenario: string): Promise<{ vesselId: number, maneuverId: number }[]> {
  const file = "/data/Scenarios/" + scenario + "/animation_maneuver_log.csv"
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
