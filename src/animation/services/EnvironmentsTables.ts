import { Environment } from "@/src/animation/entities/Environments/Environment"
import { EnvSnapshot } from "../entities/Environments/EnvTeste"


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

