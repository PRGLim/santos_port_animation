import Papa from "papaparse"
import { Route } from "@/src/animation/entities/Route"
import { Point } from "@/src/animation/entities/Point"

type RouteRow = {
  route_id: string
  lat: string
  lng: string
  seq: string
  berthRoute: string
}

export async function loadRoutesFromCSV(): Promise<Map<number, Route>> {
  // ✅ caminho correto
  const res = await fetch("/data/Defs/def_routes.csv")
  const csvText = await res.text()
  console.log("CSV RAW:", csvText.slice(0, 200))

  const parsed = Papa.parse<RouteRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  })

  const routesMap = new Map<number, [Point[], boolean]>()

  parsed.data.forEach((row) => {
    const routeId = Number(row.route_id)
    const berthRoute = row.berthRoute === "1"

    const point: Point = {
      lat: parseFloat(row.lat),
      lng: parseFloat(row.lng),
    }

    if (!routesMap.has(routeId)) {
      routesMap.set(routeId, [[], berthRoute])
    }

    routesMap.get(routeId)![0].push(point)
  })

  const routes = new Map<number, Route>()
  
  routesMap.forEach(([points, berthRoute], id ) => {
    routes.set(id, new Route(id, points, berthRoute))
  })

  return routes
}
