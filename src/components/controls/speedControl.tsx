"use client"

import React from "react"

type Props = {
  speed: number
  onIncrease: () => void
  onDecrease: () => void
}

export function SpeedControl({ speed, onIncrease, onDecrease }: Props) {
  return (
    <div className="speed-control">
      <span className="speed-value">{speed.toFixed(1)}x</span>
      <button onClick={onDecrease}>➖</button>
      <button onClick={onIncrease}>➕</button>
    </div>
  )
}
