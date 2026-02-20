import { DISPLAY_TIME_SCALE, SIMULATION_BASE_DATE } from "../animation/core/constants"

type SimTimeUnit = "ms" | "s" | "tick"

export function convertSimTime(
  time: number,
  unit: SimTimeUnit = "ms"
) {
  let offsetMs: number

  switch (unit) {
    case "ms":
      offsetMs = time
      break

    case "s":
      offsetMs = time * 1000
      break

    case "tick":
      offsetMs = time * DISPLAY_TIME_SCALE
      break

    default:
      offsetMs = time
  }

  return new Date(SIMULATION_BASE_DATE.getTime() + offsetMs)
}


export function formatSimTimeInDate(
  time: number,
  unit: SimTimeUnit = "ms"
) {
  const currentDate = convertSimTime(time, unit)

  const day = String(currentDate.getDate()).padStart(2, "0")
  const month = String(currentDate.getMonth() + 1).padStart(2, "0")
  const year = currentDate.getFullYear()

  const hours = String(currentDate.getHours()).padStart(2, "0")
  const minutes = String(currentDate.getMinutes()).padStart(2, "0")
  const seconds = String(currentDate.getSeconds()).padStart(2, "0")

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}


