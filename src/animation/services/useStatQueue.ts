import { useRef, useState } from "react"
import { Vessel } from "@/src/animation/entities/Vessel"
import { VesselStatus } from "@/src/animation/types/vesselStatus"

export type QueuePoint = {
  time: number
  queue: number
}

type UseQueueStatsResult = {
  queueSize: number
  history: QueuePoint[]
  avgWaitTime: number
  maxWaitTime: number
  update: (vessels: Vessel[], time: number) => void
  reset: () => void
}

export function useQueueStats(): UseQueueStatsResult {
  const [queueSize, setQueueSize] = useState(0)
  const [history, setHistory] = useState<QueuePoint[]>([])
  const [avgWaitTime, setAvgWaitTime] = useState(0)
  const [maxWaitTime, setMaxWaitTime] = useState(0)

  // guarda tempos de espera já finalizados
  const completedWaitTimes = useRef<number[]>([])

  function update(vessels: Vessel[], time: number) {

    // =========================
    // Fila atual
    // =========================
    const inQueue = vessels.filter(v => {
      const state = v.getStateAt(time)
      return state?.status === VesselStatus.IN_QUEUE
    })
    

    setQueueSize(inQueue.length)

    // =========================
    // Histórico da fila
    // =========================
    setHistory(prev => {
      const last = prev.at(-1)
      if (last && time - last.time < 5) return prev // salva a cada 5s
      time = time / 1000
      return [...prev, { time, queue: inQueue.length }]
    })

    // =========================
    // Tempos de espera (todos que já passaram na fila)
    // =========================
    
    vessels.forEach(v => {
      if (
        v.queueEnterTime != null &&
        v.queueExitTime != null
      ) {
        const wait = (v.queueExitTime - v.queueEnterTime) / 1000 / 60

        // evita duplicar
        if (!completedWaitTimes.current.includes(wait)) {
          completedWaitTimes.current.push(wait)
        }
      }
    })

    // =========================
    // Métricas
    // =========================
    const waits = completedWaitTimes.current

    if (waits.length > 0) {
      const sum = waits.reduce((a, b) => a + b, 0)
      setAvgWaitTime(sum / waits.length)
      setMaxWaitTime(Math.max(...waits))
    }
  }

  function reset() {
    setQueueSize(0)
    setHistory([])
    setAvgWaitTime(0)
    setMaxWaitTime(0)
    completedWaitTimes.current = []
  }


  return {
    queueSize,
    history,
    avgWaitTime,
    maxWaitTime,
    update,
    reset,
  }
}
