import { Point } from "./Point"

export class Route {
  id: number
  points: Point[]
  berthRoute: boolean

  constructor(id: number, points: Point[], berthRoute: boolean = false) {
    this.id = id
    this.points = points
    this.berthRoute = berthRoute
  }

  getPointAt(progress: number) {
    if (this.points.length === 0) return null
    if (this.points.length === 1) return this.points[0]

    progress = Math.max(0, Math.min(progress, 0.999999))

    const totalSegments = this.points.length - 1
    const exactIndex = progress * totalSegments

    const i = Math.floor(exactIndex)
    const t = exactIndex - i

    const p1 = this.points[i]
    const p2 = this.points[i + 1]

    if (!p1 || !p2) return null

    console.log("P1:", p1)
    console.log("P2:", p2)
    
    console.log("LAT", p1.lat + (p2.lat - p1.lat) * t)
    console.log("LONG", p1.lng + (p2.lng - p1.lng) * t)

    return {
      lat: p1.lat + (p2.lat - p1.lat) * t,
      lng: p1.lng + (p2.lng - p1.lng) * t,
    }
  }
}
