"use client"

import React from "react"

type Props = {
  time: number
}

export function TimeDisplay({ time }: Props) {
  const totalSeconds = Math.floor(time / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return <div className="time-display">⏱ {`${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`}</div>
}
