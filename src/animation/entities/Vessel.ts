import { VesselRouteExecution } from "./VesselRouteExecution"
import { Point } from "./Point"
import { gradualAngleCalculator } from "../../utils/navigation"

export class Vessel {
  id: number
  executions: VesselRouteExecution[]
  heading: number = 0
     

  constructor(
    id: number,
    executions: VesselRouteExecution[] = [],
  ) {
    this.id = id
    this.executions = executions
  }

  // 🔹 Estado completo do navio no tempo
  getStateAt(time: number): { position: Point; heading: number } | null {
    const active = this.executions.find(e => e.isActiveAt(time))
    if (!active) return null

    const pos = active.getInterpolatedPosition(time)
    if (!pos) return null

    // 🔹 heading alvo vindo da rota
    const targetHeading = active.getTargetHeadingAt(time)

    if (targetHeading != null) {
      this.heading = gradualAngleCalculator(
        this.heading,
        targetHeading,
        3 // taxa de giro (graus por tick)
      )
    }

    return {
      position: pos,
      heading: this.heading,
    }
  }
}
