import { DISPLAY_TIME_SCALE, SIMULATION_BASE_DATE } from "../animation/core/constants"

export function convertSimTime(time: number){
  
  const simulatedOffsetMs = time * DISPLAY_TIME_SCALE
  const currentDate = new Date(SIMULATION_BASE_DATE.getTime() + simulatedOffsetMs)
  return currentDate
}

export function formatSimTimeInDate(time: number) {

  const currentDate = convertSimTime(time)

  const day = String(currentDate.getDate()).padStart(2, "0")
  const month = String(currentDate.getMonth() + 1).padStart(2, "0")
  const year = currentDate.getFullYear()

  const hours = String(currentDate.getHours()).padStart(2, "0")
  const minutes = String(currentDate.getMinutes()).padStart(2, "0")
  const seconds = String(currentDate.getSeconds()).padStart(2, "0")
  

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}