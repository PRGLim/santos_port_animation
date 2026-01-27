import { VesselRouteExecution } from "./VesselRouteExecution"
import { Point } from "./Point"
import { angleCalculator, gradualAngleCalculator } from "../../utils/navigation"

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

  getStateAt(time: number): { position: Point; heading: number } | null {
    const active = this.executions.find(e => e.isActiveAt(time))
    if (!active) return null

    const pos = active.getInterpolatedPosition(time)

    if (!pos){
      return null
    }
  
    const targetHeading = active.getTargetHeadingAt(time)
    this.heading = targetHeading ?? 0

    // if (targetHeading != null) {
    //   this.heading = gradualAngleCalculator(
    //     this.heading,
    //     targetHeading,
    //     1
    //   )
    // } 
  
    return {
      position: pos,
      heading: this.heading,
    }
  }
}
