import Papa from "papaparse"
import { VesselDetail } from "../entities/VesselDetail"

type DetailRow = {
  vessel_id: string
  loa: string
  beam: string
  draft: string
  berth: string
  berth_arrival: string
  berth_departure: string
  berth_ideal_duration: string
}

export async function loadVesselDetailFromCSV(): Promise<Map<number, VesselDetail>> {
  const res = await fetch("/data/def_vessel.csv")
  const csvText = await res.text()

  const parsed = Papa.parse<DetailRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  })

  const vesselMap = new Map<number, VesselDetail>()

  parsed.data.forEach(row => {
    const id = Number(row.vessel_id)

    vesselMap.set(
      id,
      new VesselDetail(
        id,
        Number(row.loa),
        Number(row.beam),
        Number(row.draft),
        row.berth,
        row.berth_arrival,
        row.berth_departure,
        row.berth_ideal_duration
      )
    )
  })

  return vesselMap
}
