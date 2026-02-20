// animation/simulation/SimulationController.ts
import { SimulationClock } from "../core/SimulationClock"
import { Vessel } from "../entities/Vessel"
import { loadRoutesFromCSV } from "../loaders/Defs/loadRouteFromCsv"
import { loadShipLogsFromCSV } from "../loaders/Logs/loadShipLogFromCsv"

type TickCallback = (time: number, vessels: Vessel[]) => void

export class SimulationController {
  private clock: SimulationClock | null = null
  private vessels: Vessel[] = []

  public startTime = 0
  public endTime = 0

  async init() {
    const routes = await loadRoutesFromCSV()
    const executions = await loadShipLogsFromCSV(routes)
    const vesselsMap = new Map<number, Vessel>()

    executions.forEach((e) => {
      if (!vesselsMap.has(e.vesselId)) {
        vesselsMap.set(e.vesselId, new Vessel(e.vesselId, []))
      }
      vesselsMap.get(e.vesselId)!.executions.push(e)
    })

    
    this.vessels = Array.from(vesselsMap.values())

    this.vessels.forEach(v => {
      v.resolveQueueTimes()
      v.resolveThroughput()
    })


    this.startTime = Math.min(...executions.map(e => e.startTime))
    this.endTime   = Math.max(...executions.map(e => e.endTime))

    this.clock = new SimulationClock(this.startTime, this.endTime)
  }

  onTick(cb: TickCallback) {
    this.clock?.onTick((time) => {
      cb(time, this.vessels)
    })
  }

  play() {
    this.clock?.play()
  }

  pause() {
    this.clock?.pause()
  }

  seek(time: number) {
    this.clock?.seek(time)
  }

  setSpeed(speed: number) {
    this.clock?.setSpeed(speed)
  }

  getTime() {
    return this.clock?.getTime() ?? 0
  }
}
