import Papa from "papaparse"
import { SCENARIO } from "../../core/constants"


type SettingsRow = {
  scenario_id: string
  startDay: string
}

export async function loadSettingsLog(): Promise<{ scenario_id: string, startDay: string }[]> {
  const file = "/data/Scenarios/" + SCENARIO + "/scenario_settings.csv"
  const res = await fetch("/data/Defs/scenario_settings.csv")
  const text = await res.text()

  const parsed = Papa.parse<SettingsRow>(text, {
    header: true,
    delimiter: ";",
    skipEmptyLines: true,
  })

  return parsed.data.map(row => ({
    scenario_id: row.scenario_id,
    startDay: row.startDay
  }))
}
