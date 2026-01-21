"use client"

import React from "react"

type Props = {

  // TIMELINE
  time: number
  min: number
  max: number
  onChange: (value: number) => void

  // PLAY AND PAUSE
  isPlaying: boolean
  onToggle: () => void
}

function formatTime(time: number) {
  // Data base da simulação
  const baseDate = new Date(2026, 0, 21, 0, 0, 0) // 21/01/2026 00:00

  // Soma o offset da simulação
  const currentDate = new Date(baseDate.getTime() + time)

  const day = String(currentDate.getDate()).padStart(2, "0")
  const month = String(currentDate.getMonth() + 1).padStart(2, "0")
  const year = currentDate.getFullYear()

  const hours = String(currentDate.getHours()).padStart(2, "0")
  const minutes = String(currentDate.getMinutes()).padStart(2, "0")
  const seconds = String(currentDate.getSeconds()).padStart(2, "0")

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}


export function BottomControl({ time, min, max, onChange, isPlaying, onToggle }: Props) {

  return (
    <div className="timeline-overlay">
        <input
        type="range"
        min={min}
        max={max}
        value={time}
        onChange={(e) => onChange(Number(e.target.value))}
        />
        <div className="timeline-time">
            <div className="time-line-labels">
                <span>{formatTime(time)}</span>
            </div>

            <button
            onClick={onToggle}
            className={isPlaying ? "btn-pause" : "btn-play"}
            style={{ marginRight: "8px" }}
            >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
            </button>

            <div className="time-line-labels">
                <span>{formatTime(max)}</span>
            </div>
        </div>
    </div>
  )
}
