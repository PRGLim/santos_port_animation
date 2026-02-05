export type QueuePoint = {
  time: number
  queue: number
}

export type KPIS = {
  queueKPI: QueueKPI
  throughputKPI: ThroughputKPI
}

export type QueueKPI = {
  queueSize: number
  avgWaitTime: number
  maxWaitTime: number
}

export type ThroughputKPI = {
  avgExitsByDay: number,
  avgEnterByDay: number
}
