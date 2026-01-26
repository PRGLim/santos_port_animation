export type StationValue = {
  station: string
  value: number
}

export type EnvSnapshot = {
  time: Date
  values: StationValue[]
}
