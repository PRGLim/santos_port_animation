import { EnvSnapshot } from "../entities/Environments/EnvTeste";
import { useMemo } from "react"

type EnvironmentInputs = {
  tide?: EnvSnapshot[]
  wind?: EnvSnapshot[]
  current?: EnvSnapshot[]
}

type EnvironmentState = {
  tide?: EnvSnapshot
  wind?: EnvSnapshot
  current?: EnvSnapshot
}


function getEnvAtTime(
  env: EnvSnapshot[] | undefined,
  simTime: number
): EnvSnapshot | undefined {
  if (!env || env.length === 0) return undefined

  const startTime = env[0].time
  const stepMs = 5 * 60 * 1000

  const index = Math.floor((simTime - Number(startTime)) / stepMs)

  return env[Math.max(0, Math.min(env.length - 1, index))]
}


export function useEnvironment(
  simTime: number,
  envs: EnvironmentInputs
): EnvironmentState {

  return useMemo(() => {
    return {
      tide: getEnvAtTime(envs.tide, simTime),
      wind: getEnvAtTime(envs.wind, simTime),
      current: getEnvAtTime(envs.current, simTime),
    }
  }, [simTime, envs.tide, envs.wind, envs.current])
}
