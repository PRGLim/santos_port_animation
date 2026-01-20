export class VesselDetail {
  id: number
  loa: number
  beam: number
  draft: number
  berth: string

  constructor(
    id: number,
    loa: number,
    beam: number,
    draft: number,
    berth: string
  ) {
    this.id = id
    this.loa = loa
    this.beam = beam
    this.draft = draft
    this.berth = berth
  }
}
