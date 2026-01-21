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
      <button onClick={onDecrease}>➖</button>
      <span className="speed-value">{speed.toFixed(1)}x</span>
      <button onClick={onIncrease}>➕</button>
    </div>
  )
}
