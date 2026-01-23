import Papa from "papaparse"
import { EnvSnapshot, StationValue } from "../../entities/Environments/EnvTeste"

type RawRow = Record<string, any>


export async function loadEnvFromCSV(filename: string, simStartTime: number, simEndTime: number): Promise<EnvSnapshot[]> {
  const res = await fetch(filename)
  const csvText = await res.text()

  console.log(simEndTime)

  const parsed = Papa.parse<RawRow>(csvText, {
    header: true,
    skipEmptyLines: true,
    delimiter: ";"
  })

  const result: EnvSnapshot[] = [] 

  parsed.data.forEach(row => {
    const timeStr = row["DATETIME"]
    if (!timeStr) return

    const time = new Date(timeStr).getTime()


    if (time < simStartTime || time > simEndTime) return


    const values: StationValue[] = []


    Object.entries(row).forEach(([column, rawValue]) => {
      if (column === "DATETIME") return
      if (rawValue == null || rawValue === "") return

      values.push({
        station: column,
        value: Number(rawValue.replace(",", ".")),
      })
    })

    result.push({ time: timeStr, values })
  })

  return result 
}
