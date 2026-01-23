import { EnvValue } from "@/src/animation/entities/Environments/EnvValue"


type Props = {
  current: Array<EnvValue>
}

export default function EnvironmentLabel({current}: Props) {


  return (
    <div className="enviroment-label">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=sailing" />
        {current.map(station => (
            <p key={station.station}> {station.station}: {station.value} </p>
        ))}
    </div>
  )
}
