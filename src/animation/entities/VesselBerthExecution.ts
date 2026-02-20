export enum ExecutionType {
  MOVE = "move",
  QUEUE = "queue",
  BERTH = "berth",
}

export class VesselBerthExecution {
  vesselId: number
  startTime: number
  endTime: number

  
  constructor(
    vesselId: number,
    startTime: number,
    endTime: number,


  ) {
    this.vesselId = vesselId
    this.startTime = startTime
    this.endTime = endTime
  }}
