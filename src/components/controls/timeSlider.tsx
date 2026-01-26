"use client"

import { formatSimTimeInDate } from "@/src/utils/timeUtils"
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
                <span>{formatSimTimeInDate(time)}</span>
            </div>

            <button
            onClick={onToggle}
            className={isPlaying ? "btn-pause" : "btn-play"}
            style={{ marginRight: "8px" }}
            >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
            </button>

            <div className="time-line-labels">
                <span>{formatSimTimeInDate(max)}</span>
            </div>
        </div>
    </div>
  )
}
