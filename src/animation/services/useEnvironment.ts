import { convertSimTime } from "@/src/utils/timeUtils";
import { EnvSnapshot } from "../entities/Environments/EnvTeste";
import { useMemo } from "react"

type EnvironmentInputs = {
  tideHeight?: EnvSnapshot[]
  current?: EnvSnapshot[]
  visibility?: EnvSnapshot[]
  waveFreq?: EnvSnapshot[]
  waveHeight?: EnvSnapshot[]
  windSpeed?: EnvSnapshot[]
}

type EnvironmentState = {
  tideHeight?: EnvSnapshot
  current?: EnvSnapshot
  visibility?: EnvSnapshot
  waveFreq?: EnvSnapshot
  waveHeight?: EnvSnapshot
  windSpeed?: EnvSnapshot
}


function getEnvAtTime(
  env: EnvSnapshot[] | undefined,
  simTime: number
): EnvSnapshot | undefined {
  if (!env || env.length === 0) return undefined

  const currentDate = convertSimTime(simTime, "tick").getTime()
  const startTimestamp = env[0].time.getTime()
  
  const stepMs = 5 * 60 * 1000  // 5 minutos

  const index = Math.floor(
    (Number(currentDate) - startTimestamp) / stepMs
  )


  return env[Math.max(0, Math.min(env.length - 1, index))]
}

export function useEnvironment(


  simTime: number,
  envs: EnvironmentInputs
): EnvironmentState {


  return useMemo(() => {
    return {
      tideHeight: getEnvAtTime(envs.tideHeight, simTime),
      current: getEnvAtTime(envs.current, simTime),
      visibility: getEnvAtTime(envs.visibility, simTime),
      waveFreq: getEnvAtTime(envs.waveFreq, simTime),
      waveHeight: getEnvAtTime(envs.waveHeight, simTime),
      windSpeed: getEnvAtTime(envs.windSpeed, simTime),
    }
  }, [
      simTime, 
      envs.tideHeight, 
      envs.current,
      envs.visibility,
      envs.waveFreq, 
      envs.waveHeight,
      envs.windSpeed
    ])

    
}

