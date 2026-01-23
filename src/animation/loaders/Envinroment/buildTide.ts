import { Environment } from "@/src/animation/entities/Environments/Environment"

export function buildTideSeries(
  raw: { time: number; row: any }[]
): Environment<{ level: number; source: string }> {
  return {
    id: "tide",
    name: "Tide",
    startTime: raw[0].time,
    stepMs: 5 * 60 * 1000,
    data: raw.map(r => ({
      level: Number(r.row.Mare),
      source: r.row.Origem
    }))
  }
}