import { VesselRouteExecution } from "./VesselRouteExecution"
import { Point } from "./Point"
import { angleCalculator, gradualAngleCalculator } from "../../utils/navigation"
import { VesselStatus } from "../types/vesselStatus"

export class Vessel {
  id: number
  executions: VesselRouteExecution[]
  heading: number = 0
  lastPosition?: Point
   
  constructor(
    id: number,
    executions: VesselRouteExecution[] = [],
  ) {
    this.id = id
    this.executions = executions
  }


  // getFirstExecution() {
  //   return this.executions.at(0) ?? null
  // }

  // getLastExecution() {
  //   return this.executions.at(-1) ?? null
  // }

  // getActiveExecutionAt(time: number, start: number, end: number) {

  //   return this.executions.find(e => e.isActiveAt(time, start, end)) ?? null
  // }


  // getStateAt(time: number): { position: Point; heading: number } | null {

  //   const firstMov = this.getFirstExecution()?.startTime
  //   const lastMov = this.getLastExecution()?.endTime


  //   const active = this.getActiveExecutionAt(time, Number(firstMov), Number(lastMov))

  //   if (!active) 
  //     {
  //       return null
  //     }

  //   const pos = active.getInterpolatedPosition(time)

  //   if (!pos){
  //     return null
  //   }
  
  //   const targetHeading = active.getTargetHeadingAt(time)
  //   this.heading = targetHeading ?? 0

  //   // if (targetHeading != null) {
  //   //   this.heading = gradualAngleCalculator(
  //   //     this.heading,
  //   //     targetHeading,
  //   //     1
  //   //   )
  //   // } 
  
  //   return {
  //     position: pos,
  //     heading: this.heading,
  //   }
  // }




  getStateAt(
    time: number
  ): { position: Point; heading: number, status: VesselStatus} | null {

    // for in and out transits OJO its null for berthed vessels
    const active = this.executions.find(e => e.isActiveAt(time))

    if (active) {
      let pos = active.getInterpolatedPosition(time)

      if (!pos) {
        console.log("NO POSITION" )
        pos = active.getStartPosition()
      }

      const targetHeading = active.getTargetHeadingAt(time)
      
      this.heading = targetHeading ?? this.heading ?? 0
      this.lastPosition = pos

      return {
        position: pos,
        heading: this.heading,
        status: VesselStatus.MOVING
      }
      
    }


    // for berthed vessels
    for (let i = 0; i < this.executions.length - 1; i++) {
      const curr = this.executions[i]
      const next = this.executions[i + 1]

      if (
        curr.route.berthRoute &&
        next.route.berthRoute &&
        time >= curr.endTime &&
        time <= next.startTime
      ) {

        const pos = curr.getEndPosition()
        if(!pos){
          console.log("NO POS ON BERTH")
        }

        return {
          position: pos,
          heading: this.heading ?? 0, // mantém último heading
          status: VesselStatus.BERTHED
        }
        this.lastPosition = pos

      }
    }

    
    if (this.lastPosition) {
      return {
        position: this.lastPosition,
        heading: this.heading ?? 0,
        status: VesselStatus.MOVING
      }
    }

    return null
  }

}
