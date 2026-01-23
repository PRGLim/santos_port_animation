export class SimulationClock {
  private time: number
  private start: number
  private end: number
  private tickCallback: ((t: number) => void) | null = null
  private speed = 1
  private rafId: number | null = null
  private lastFrameTime: number = 0

  constructor(start: number, end: number) {
    this.start = start
    this.end = end
    this.time = start
  }

  onTick(cb: (t: number) => void) {
    this.tickCallback = cb
  }

  play() {
    if (this.rafId) return
    this.lastFrameTime = performance.now()
    const loop = (now: number) => {
      const delta = now - this.lastFrameTime
      this.lastFrameTime = now

      this.time += delta * this.speed

      if (this.time >= this.end) {
        this.time = this.end
        this.pause()
      }

      this.tickCallback?.(this.time)

      this.rafId = requestAnimationFrame(loop)
    }
    this.rafId = requestAnimationFrame(loop)
  }

  pause() {
    if (this.rafId) cancelAnimationFrame(this.rafId)
    this.rafId = null
  }

  seek(time: number) {
    this.time = Math.max(this.start, Math.min(time, this.end))
    this.tickCallback?.(this.time)
  }

  setSpeed(speed: number) {
    this.speed = Math.max(0.1, speed)
  }

  getTime() {
    return this.time
  }

  getSpeed() {
    return this.speed
  }
  getStart() {
    return this.start
  }

  getEnd() {
    return this.end
  }
}
