import Papa from "papaparse"
import { VesselDetail } from "../../entities/VesselDetail"
import { SCENARIO } from "../../core/constants"

type DetailRow = {
  SCENARIO_ID: number,
  ARRIVAL_ID: number
  LOA: number
  BEAM: number
  DRAFT: number
  TERMINAL_ID: string
  TERMINAL_MARKET_CATEGORY: string
  BERTH: string
  CATEGORY: string
  DETAILED_CATEGORY: string
  PROCESS_TIME: string
  SHORT_NAME: string
}


export async function loadVesselDetailFromCSV(): Promise<Map<number, VesselDetail>> {
  const file = `/data/Scenarios/${SCENARIO}/vessel_info_log.csv`
  const res = await fetch(file)
  const csvText = await res.text()

  const parsed = Papa.parse<DetailRow>(csvText, {
    header: true,
    delimiter: ";",
    skipEmptyLines: true,
  })

  const vesselMap = new Map<number, VesselDetail>()

  parsed.data.forEach(row => {
    const id = Number(row.ARRIVAL_ID)

    vesselMap.set(
      id,
      new VesselDetail(
        id,
        Number(row.LOA),
        Number(row.BEAM),
        Number(row.DRAFT),
        row.TERMINAL_ID,
        row.BERTH,
        row.CATEGORY,
        row.DETAILED_CATEGORY,
        row.PROCESS_TIME,
        undefined,
        row.TERMINAL_MARKET_CATEGORY
      )
    )
  })
  return vesselMap
}


