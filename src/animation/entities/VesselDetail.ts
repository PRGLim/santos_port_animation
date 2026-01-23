import { VesselStatus } from "../types/vesselStatus"

export class VesselDetail {
  id: number
  loa: number
  beam: number
  draft: number
  berth: string
  berth_arrival: string
  berth_departure: string
  berth_ideal_duration: string



  constructor(
    id: number,
    loa: number,
    beam: number,
    draft: number,
    berth: string,
    berth_arrival: string,
    berth_departure: string,
    berth_ideal_duration: string,

  ) {
    this.id = id
    this.loa = loa
    this.beam = beam
    this.draft = draft
    this.berth = berth
    this.berth_arrival = berth_arrival
    this.berth_departure = berth_departure
    this.berth_ideal_duration = berth_ideal_duration
  }



}
