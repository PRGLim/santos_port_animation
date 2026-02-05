import { useRef, useState } from "react"
import { Vessel } from "@/src/animation/entities/Vessel"
import { VesselStatus } from "@/src/animation/types/vesselStatus"
import { QueueKPI, ThroughputKPI } from "../types/kpis"



type UseStatsResult = {
  queueKPI: QueueKPI
  throughputKPI: ThroughputKPI
  update: (vessels: Vessel[], time: number) => void
  reset: () => void
}


function generateQueueKPI(
  prev: QueueKPI,
  vessels: Vessel[],
  time: number,
  completedWaitTimes: number[]
): QueueKPI {
  // fila atual
  const inQueue = vessels.filter(v => {
    const state = v.getStateAt(time)
    return state?.status === VesselStatus.IN_QUEUE
  })


  // tempos de espera finalizados
  vessels.forEach(v => {
    if (v.queueEnterTime != null && v.queueExitTime != null) {
      const wait =
        (v.queueExitTime - v.queueEnterTime) / 1000 / 60

      if (!completedWaitTimes.includes(wait)) {
        completedWaitTimes.push(wait)
      }
    }
  })

  // métricas
  let avgWaitTime = prev.avgWaitTime
  let maxWaitTime = prev.maxWaitTime

  if (completedWaitTimes.length > 0) {
    const sum = completedWaitTimes.reduce((a, b) => a + b, 0)
    avgWaitTime = sum / completedWaitTimes.length
    maxWaitTime = Math.max(...completedWaitTimes)
  }

  return {
    queueSize: inQueue.length,
    avgWaitTime,
    maxWaitTime,
  }
}

function generateThoughputKPI(
  prev: ThroughputKPI,
  vessels: Vessel[],
  time: number,
): ThroughputKPI {
    
  const processedVessels = vessels.filter(v => v.exitHour !== undefined && v.exitHour <= (time / 1000 / 60))
  const arrivedVessels = vessels.filter(v => v.enterHour !== undefined && v.enterHour <= (time / 1000 / 60))

  return {
    avgExitsByDay: processedVessels.length,
    avgEnterByDay: arrivedVessels.length
  }
}

export function useKPIS(): UseStatsResult {

  const [queueKPI, setQueueKPI] = useState<QueueKPI>({
    queueSize: 0,
    avgWaitTime: 0,
    maxWaitTime: 0,
  })

  const [throughputKPI, setThroughputKPI] = useState<ThroughputKPI>({
    avgExitsByDay: 0,
    avgEnterByDay:0 
  })

  const completedWaitTimes = useRef<number[]>([])


  function update(vessels: Vessel[], time: number) {
    // 1. QUEUE
    setQueueKPI(prev =>
      generateQueueKPI(
        prev,
        vessels,
        time,
        completedWaitTimes.current
      )
    )

  // 2. THROUGHPUT

    setThroughputKPI(prev =>
      generateThoughputKPI(
        prev,
        vessels,
        time
      )
    )

  }

  function reset() {
    completedWaitTimes.current = []
    setQueueKPI({
      queueSize: 0,
      avgWaitTime: 0,
      maxWaitTime: 0,
    })

    setThroughputKPI({
      avgExitsByDay: 0,
      avgEnterByDay: 0
    })
  }

  return {
    queueKPI,
    throughputKPI,
    update,
    reset,
  }
}

