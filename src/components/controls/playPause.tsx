"use client"

import React from "react"

type Props = {
  isPlaying: boolean
  onToggle: () => void
}

export function PlayPauseButton({ isPlaying, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className={isPlaying ? "btn-pause" : "btn-play"}
      style={{ marginRight: "8px" }}
    >
      {isPlaying ? "⏸ Pause" : "▶ Play"}
    </button>
  )
}
