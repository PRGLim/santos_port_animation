export type StationValue = {
  station: string
  value: number
}

export type EnvSnapshot = {
  time: string
  values: StationValue[]
}
