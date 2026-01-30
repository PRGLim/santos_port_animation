import { useRef, useState } from "react"
import { Vessel } from "@/src/animation/entities/Vessel"
import { VesselStatus } from "@/src/animation/types/vesselStatus"



type UseMovementStatsResult = {
  avgEntersByDay: number
  avgExitsByDay: number
  update: (vessels: Vessel[], time: number) => void
  reset: () => void
}

export function useThroughputStats(): UseMovementStatsResult {
  const [avgEntersByDay, setAvgEntersByDay] = useState(0)
  const [avgExitsByDay, setAvgExitsByDay] = useState(0)

  // guarda tempos de espera já finalizados
  const completedWaitTimes = useRef<number[]>([])

  function update(vessels: Vessel[], time: number) {


    // =========================
    // Tempos de espera (todos que já passaram na fila)
    // =========================
    
    vessels.forEach(v => {

        const dailyGroups = vessels.reduce((acc, v) => {
        if (v.enterHour != null && v.exitHour != null) {
            const day = new Date(v.enterHour).toISOString().split('T')[0];
            acc[day] = (acc[day] || 0) + 1;
        }
        return acc;
        }, {} as Record<string, number>);

        const avgEntersByDay = Object.keys(dailyGroups).length > 0
        ? Object.values(dailyGroups).reduce((sum, count) => sum + count, 0) / Object.keys(dailyGroups).length
        : 0;

        console.log(dailyGroups)
        setAvgEntersByDay(avgEntersByDay);
    })}

    // =========================
    // Métricas
    // =========================

  function reset() {
    setAvgEntersByDay(0)
    setAvgExitsByDay(0)
  }


  return {
    avgEntersByDay,
    avgExitsByDay,
    update,
    reset,
  }
}
