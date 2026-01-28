import { Route } from "./Route"
import { Point } from "./Point"
import { VesselDetail } from "./VesselDetail"
import { angleCalculator } from "@/src/utils/navigation"
import { Console } from "console"
import { VesselStatus } from "../types/vesselStatus"

export class VesselRouteExecution {
  vesselId: number
  route: Route
  startTime: number
  endTime: number
  forward: boolean
  maneuver?: [number, number]
  
  constructor(
    vesselId: number,
    route: Route,
    startTime: number,
    endTime: number,
    forward: boolean,
    maneuver?: [number, number],

  ) {
    this.vesselId = vesselId
    this.route = route
    this.startTime = startTime
    this.endTime = endTime
    this.forward = forward
  }

  
  isActiveAt(time: number): boolean {
    return time >= this.startTime && time <= this.endTime 
  }

  getEndPosition(): Point {
    const pts = this.route.points
    return this.forward
      ? pts[pts.length - 1]
      : pts[0]
  }

  getStartPosition(): Point {
    const pts = this.route.points
    return this.forward
      ? pts[0]
      : pts[pts.length - 1]
  }

  getPositionAt(time: number) {

    if(time > this.endTime) time = this.endTime

    if (time < this.startTime || time > this.endTime) return null

    const progress = (time - this.startTime) / (this.endTime - this.startTime)

    // se forward, progress normal; se backward, inverte
    const effectiveProgress = this.forward ? progress : 1 - progress

    return this.route.getPointAt(effectiveProgress)
  }

  getTargetHeadingAt(time: number): number | null {
    
    if (!this.isActiveAt(time)) return null

    if (this.route.berthRoute && this.maneuver != undefined) {

      if (!this.maneuver) return null
       var angle = 0
        if(this.forward)
          angle = (Number(this.maneuver[0]) + 180) 
        else
          angle = (Number(this.maneuver[1]) + 180)
      return angle
    }

    const points = this.forward
      ? this.route.points
      : [...this.route.points].reverse()

    const progress = (time - this.startTime) / (this.endTime - this.startTime)
    const segmentCount = points.length - 1
    const segmentIndex = Math.floor(progress * segmentCount)

    const p1 = points[segmentIndex]
    const p2 = points[segmentIndex + 1]

    // const p1 = this.route.points[0]
    // const p2 = this.route.points[1]

    if (!p1 || !p2) return null

    return angleCalculator(p1.lng, p1.lat, p2.lng, p2.lat)
  }

  getInterpolatedPosition(time: number): Point | null {
    if (!this.isActiveAt(time)) return null

    const points = this.forward ? this.route.points : [...this.route.points].reverse()
    const progress = (time - this.startTime) / (this.endTime - this.startTime)
    const segmentCount = points.length - 1
    const segmentIndex = Math.floor(progress * segmentCount)
    const localProgress = (progress * segmentCount) - segmentIndex

    const p0 = points[segmentIndex]
    const p1 = points[segmentIndex + 1]

    if (!p0 || !p1) return null

    return {
      lat: p0.lat + (p1.lat - p0.lat) * localProgress,
      lng: p0.lng + (p1.lng - p0.lng) * localProgress,
  }}

}

