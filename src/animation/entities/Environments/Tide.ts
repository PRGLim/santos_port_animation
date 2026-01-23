// entities/tide.ts
import { Environment } from "./Environment"
import { EnvValue } from "./EnvValue"

export function getTideValuesAtTime(
  env: Environment<EnvValue>,
  time: number
): EnvValue[] {
  const index = Math.floor((time - env.startTime) / env.stepMs)

  const value = env.data[index]
  if (!value) return []

  return [value]
}
