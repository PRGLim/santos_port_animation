import { ExecutionType, VesselRouteExecution } from "./VesselRouteExecution"
import { Point } from "./Point"
import { angleCalculator, gradualAngleCalculator } from "../../utils/navigation"
import { VesselStatus } from "../types/vesselStatus"
import { globalSimEnd } from "../core/constants"

export class Vessel {
  id: number
  executions: VesselRouteExecution[]
  heading: number = 0
  lastPosition?: Point
   
  queueEnterTime?: number
  queueExitTime?: number
  
  enterHour?: number
  exitHour?: number

  private queueResolved = false
  private throughputResolved = false

  constructor(
    id: number,
    executions: VesselRouteExecution[] = [],
  ) {
    this.id = id
    this.executions = executions
  }

  isFinished(time: number) {
    return time > Math.max(...this.executions.map(e => e.endTime))
  }

  resolveQueueTimes() {
    if (this.queueResolved) return

    const queueExec = this.executions.find(
      e => e.type === ExecutionType.QUEUE
    )

    if (!queueExec) {
      this.queueResolved = true
      return
    }

    this.queueEnterTime = queueExec.startTime


    const nextExec = this.executions
      .filter(e => e.type !== ExecutionType.QUEUE)
      .sort((a, b) => a.startTime - b.startTime)[0]

    if (nextExec) {
      this.queueExitTime = nextExec.startTime
    }

    this.queueResolved = true
  }

  resolveThroughput() {
    if (this.throughputResolved) return
    
    const firstEx = this.executions.find(
      e => (e.route.id == 1 && e.forward == true)
    )

    const lastEx = this.executions.find(
      e => (e.route.id == 1 && e.forward == false)
    )

    this.enterHour = (Number(firstEx?.startTime) / 1000) / 60
    if(!lastEx){
     this.exitHour = (globalSimEnd + 1) / 1000 / 60
    }else{
      this.exitHour = (Number(lastEx?.endTime) / 1000) / 60
    }
    this.throughputResolved = true
  }

  getStateAt(
    time: number
  ): { position: Point; heading: number; status: VesselStatus } | null {

    // =========================
    //  MOVE ativo
    // =========================
    const move = this.executions.find(
      e =>
        e.type === ExecutionType.MOVE &&
        time >= e.startTime &&
        time <= e.endTime
    )

    if (move) {
      let pos = move.getInterpolatedPosition(time)
      if (!pos) pos = move.getStartPosition()

      const targetHeading = move.getTargetHeadingAt(time)
      this.heading = targetHeading ?? this.heading ?? 0
      this.lastPosition = pos

      return {
        position: pos,
        heading: this.heading,
        status: VesselStatus.MOVING,
      }
    }

    // =========================
    // QUEUE herdado (rota 0)
    // =========================
    const lastQueue = [...this.executions]
      .filter(
        e =>
          e.type === ExecutionType.QUEUE &&
          e.startTime <= time
      )
      .sort((a, b) => b.startTime - a.startTime)[0]

    const nextNonQueue = this.executions.find(
      e =>
        e.type !== ExecutionType.QUEUE &&
        e.startTime > (lastQueue?.startTime ?? Infinity)
    )

    if (
      lastQueue &&
      (!nextNonQueue || time < nextNonQueue.startTime)
    ) {
      const pos = lastQueue.getStartPosition()
      this.lastPosition = pos

      return {
        position: pos,
        heading: this.heading ?? 0,
        status: VesselStatus.IN_QUEUE,
      }
    }

  // =========================
  // BERTH VIRTUAL (gap)
  // =========================
  const prev = [...this.executions]
    .filter(e => e.endTime <= time)
    .at(-1)

  const next = this.executions.find(
    e => e.startTime > time
  )

  if (
    prev?.route.berthRoute &&
    next?.route.berthRoute
  ) {
    const pos =
      prev.getEndPosition() ??
      prev.getStartPosition()

    // heading FIXO da chegada
    const heading =
      prev.getTargetHeadingAt(prev.endTime) ??
      this.heading ??
      0

    this.lastPosition = pos
    this.heading = heading

    return {
      position: pos,
      heading,
      status: VesselStatus.BERTHED,
    }
  }

    // =========================
    // Fallback
    // =========================
    if (this.lastPosition) {
      return {
        position: this.lastPosition,
        heading: this.heading ?? 0,
        status: VesselStatus.IDLE,
      }
    }

    return null
  }


}


