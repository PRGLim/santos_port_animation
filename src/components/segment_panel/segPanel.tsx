import { X } from "lucide-react"

type Props = {
  segment: string | null
  onClose?: () => void
}

export default function SegPanel({ segment, onClose }: Props) {
  if (!segment) return null

  return (
    <div
      style={{
        background: "white",
        padding: "8px 12px",
        borderRadius: 6,
        fontSize: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      {onClose && (
        <button
          onClick={onClose}
          style={{
            marginTop: 6,
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          <X size={20}/>
        </button>
      )}
      <div>
        <strong>Segmento:</strong> {segment}
      </div>
    </div>
  )
}
