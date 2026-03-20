export const SIMULATION_BASE_DATE = new Date(2025, 7, 0, 0, 0, 0) 
export const DISPLAY_TIME_SCALE = 60 // 1s real = 1 min simulado
export const SCENARIO = "2SemDragagem2035"
export const SCENARIO_NAME = "2SemDragagem2035"


export const START_DATE_FILTER = new Date(2025, 7, 0, 0, 0, 0)
export const END_DATE_FILTER = new Date(2025, 9, 30, 0, 0, 0)

export const START_MINUTES =
  (START_DATE_FILTER.getTime() - SIMULATION_BASE_DATE.getTime()) / 60000

export const END_MINUTES =
  (END_DATE_FILTER.getTime() - SIMULATION_BASE_DATE.getTime()) / 60000


const STREET_STYLE = "mapbox://styles/mapbox/streets-v12"
const SATELLITE_STYLE = "mapbox://styles/mapbox/satellite-streets-v12"

export const MAP_STYLE = STREET_STYLE

export let globalSimEnd = 8615000



