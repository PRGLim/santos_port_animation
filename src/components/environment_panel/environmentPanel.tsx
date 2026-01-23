import { EnvValue } from "@/src/animation/entities/Environments/EnvValue"
import EnvironmentLabel from "./environmentLabels"
import { EnvSnapshot } from "@/src/animation/entities/Environments/EnvTeste"


type Props = {
  tide?: EnvSnapshot
}

export default function EnvironmentPanel({tide}: Props) {

  return (
    <div className="environment-panel">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=sailing" />
     <div >
        <p>🌊 Maré:</p>
        
     </div>
    </div>
  )
}
