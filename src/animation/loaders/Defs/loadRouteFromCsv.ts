import Papa from "papaparse"
import { Route } from "@/src/animation/entities/Route"
import { Point } from "@/src/animation/entities/Point"

type RouteRow = {
  ROUTE_ID: string
  SEGMENT: string
  POINT: string
  X: string
  Y: string
  IS_BERTH_ROUTE: string
}

export async function loadRoutesFromCSV(): Promise<Map<number, Route>> {
  const res = await fetch("/data/Defs/def_routes.csv")
  const csvText = await res.text()
  const parsed = Papa.parse<RouteRow>(csvText, {
    header: true,
    delimiter: ";",
    skipEmptyLines: true,
  })

  const routesMap = new Map<number, [Point[], boolean]>()

  parsed.data.forEach((row) => {
    const routeId = Number(row.ROUTE_ID)
    const berthRoute = row.IS_BERTH_ROUTE === "True"

    const point: Point = {
      lat: parseFloat(row.X),
      lng: parseFloat(row.Y),
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
