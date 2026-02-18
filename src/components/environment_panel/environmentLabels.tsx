'use client'

import { EnvSnapshot } from "@/src/animation/entities/Environments/EnvTeste"


type Props = {
  current: EnvSnapshot | null
}

export default function EnvironmentLabel({ current }: Props) {
  return (
    <div className="environment-label">
      { current &&
        <table>
          <thead>
            <tr>
              {current!.values.map(v => (
                <th key={v.station}>{v.station}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr>
              {current!.values.map(v => (
                <td key={v.station}>{v.value}</td>
              ))}
            </tr>
          </tbody>
      </table>
      }
    </div>
  )
}
