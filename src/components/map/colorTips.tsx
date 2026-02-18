import React from "react"
import { VESSEL_MARKET_COLORS } from "@/src/animation/types/colorTips"

type VesselLegendProps = {
  title?: string
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "absolute",
    top: 12,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 10,
    pointerEvents: "none" // não bloqueia o mapa
  },
  card: {
    background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(6px)",
    padding: "8px 14px",
    borderRadius: 10,
    color: "#fff",
    fontSize: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.35)"
  },
  title: {
    fontWeight: 600,
    marginBottom: 6,
    display: "block",
    textAlign: "center"
  },
  items: {
    display: "flex",
    gap: 12
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    whiteSpace: "nowrap"
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%"
  },
  label: {
    fontSize: 11
  }
}



export const VesselLegend: React.FC<VesselLegendProps> = ({
  title = "Market"
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <span style={styles.title}>{title}</span>

        <div style={styles.items}>
          {Object.entries(VESSEL_MARKET_COLORS).map(([market, color]) => (
            <div key={market} style={styles.item}>
              <span
                style={{
                  ...styles.dot,
                  backgroundColor: color
                }}
              />
              <span style={styles.label}>{market}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
