import { VesselDetail } from "@/src/animation/entities/VesselDetail"

type Props = {
  vessel: VesselDetail | null
  onClose: () => void
  currentTime: number
}

export default function VesselPanel({ vessel, onClose , currentTime}: Props) {
  if (vessel?.id === null) return null

  return (
    <div className="vessel-panel">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=sailing" />
    
    <button onClick={onClose}>✖</button>
      <div className="Row1">
         <span className="material-symbols-outlined">sailing</span>
          <h3>Vessel: {vessel?.id}</h3>
      </div>
      <p>DESTINO: {vessel?.berth}</p>

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
            <td>{vessel?.beam}</td>
            <td>{vessel?.loa}</td>
            <td>{vessel?.draft}</td>
            </tr>
        </tbody>
        </table>
    </div>
  )
}
