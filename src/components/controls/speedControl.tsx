import React from "react";

type Props = {
  speed: number;
  onChange: (value: number) => void;
};

export function SpeedControl({ speed, onChange }: Props) {
  return (
    <div className="speed-control" style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <span className="speed-value">{speed.toFixed(1)}x</span>

      <input
        type="range"
        min={0.5}
        max={20}
        step={0.5}
        value={speed}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}