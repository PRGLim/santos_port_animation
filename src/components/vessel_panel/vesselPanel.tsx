import { VesselDetail } from "@/src/animation/entities/VesselDetail"
import { Ship } from "lucide-react"

type Props = {
  vessel: VesselDetail | null
  onClose: () => void
  currentTime: number
}

export default function VesselPanel({ vessel, onClose , currentTime}: Props) {
  if (vessel?.vessel_id === null) return null

  return (
    <div className="vessel-panel">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=sailing" />
    
    <button onClick={onClose}>✖</button>
      <div className="Row1">
          <Ship />
          <h3>Vessel: {vessel?.vessel_id}</h3>
      </div>
      <p>DESTINO: {vessel?.vessel_beam}</p>

        <table>
        <thead>
            <tr>
            <th>BEAM</th>
            <th>LOA</th>
            <th>DRAFT</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <td>{vessel?.vessel_beam}</td>
            <td>{vessel?.vessel_loa}</td>
            <td>{vessel?.vessel_draft}</td>
            </tr>
        </tbody>
        </table>
    </div>
  )
}
