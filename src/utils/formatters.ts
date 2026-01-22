export function formatTime(time: number, unit: string) {
  const baseDate = new Date(2026, 0, 21, 0, 0, 0) // 21/01/2026 00:00

  let timeConverted = 0;

  if (unit == "h"){
    timeConverted = time * 60 * 60 * 1000
  }else{
    timeConverted = time
  }

  const currentDate = new Date(baseDate.getTime() + timeConverted)

  const day = String(currentDate.getDate()).padStart(2, "0")
  const month = String(currentDate.getMonth() + 1).padStart(2, "0")
  const year = currentDate.getFullYear()

  const hours = String(currentDate.getHours()).padStart(2, "0")
  const minutes = String(currentDate.getMinutes()).padStart(2, "0")
  const seconds = String(currentDate.getSeconds()).padStart(2, "0")

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

export function msToHour(ms: number) {
  return ms / 60 / 60 / 1000
}







