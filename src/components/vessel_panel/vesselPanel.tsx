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
      <p>DESTINO: Berço {vessel?.vessel_beam}</p>
      <p>STATUS: {vessel?.vessel_status}</p>
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

      <p>CATEGORIA: {vessel?.vessel_category}</p>
      {(vessel?.vessel_detail_category != "N/A" && vessel?.vessel_detail_category) && (
        <p>CATEGORIA DETALHADA: {vessel.vessel_detail_category}</p>
      )}

    </div>
  )
}
