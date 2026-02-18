import { VesselStatus } from "../types/vesselStatus"

export class VesselDetail {
  vessel_id: number
  vessel_loa: number
  vessel_beam: number
  vessel_draft: number
  vessel_terminal: string
  vessel_berth: string
  vessel_category: string
  vessel_detail_category: string
  vessel_process_time: string
  vessel_status?: VesselStatus
  vessel_market_category?: string

  constructor(
    vessel_id: number,
    vessel_loa: number,
    vessel_beam: number,
    vessel_draft: number,
    vessel_terminal: string,
    vessel_berth: string,
    vessel_category: string,
    vessel_detail_category: string,
    vessel_process_time: string,
    vessel_status?: VesselStatus,
    vessel_market_category?: string

  ) {
    this.vessel_id = vessel_id
    this.vessel_loa = vessel_loa
    this.vessel_beam = vessel_beam
    this.vessel_draft = vessel_draft
    this.vessel_terminal = vessel_terminal
    this.vessel_berth = vessel_berth
    this.vessel_category = vessel_category
    this.vessel_detail_category = vessel_detail_category
    this.vessel_process_time = vessel_process_time
    this.vessel_market_category = vessel_market_category
  }

  setStatus(status: VesselStatus) {
    this.vessel_status = status
  }

}
