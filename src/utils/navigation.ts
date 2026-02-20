
export function gradualAngleCalculator(currentAngle = 0, targetAngle = 0, turnRate = 2) {
  // Normaliza os ângulos para 0–360
  currentAngle = (currentAngle + 360) % 360;
  targetAngle = (targetAngle + 360) % 360;

  // Diferença entre o atual e o desejado
  let angleDiff = targetAngle - currentAngle;

  // Pega o menor caminho (clockwise ou anti-clockwise)
  if (angleDiff > 180) {
    angleDiff -= 360;
  } else if (angleDiff < -180) {
    angleDiff += 360;
  }

  // Decide o próximo ângulo
  let newAngle;
  if (Math.abs(angleDiff) <= turnRate) {
    // Se já está perto, fixa no alvo
    newAngle = targetAngle;
  } else {
    // Se não, gira gradualmente
    if (angleDiff > 0) {
      newAngle = currentAngle + turnRate;
    } else {
      newAngle = currentAngle - turnRate;
    }
  }

  // Normaliza novamente para 0–360
  return (newAngle + 360) % 360;
}

export function angleCalculator(
  lng1: number,
  lat1: number,
  lng2: number,
  lat2: number
): number {

  const toRad = (deg: number) => deg * Math.PI / 180
  const toDeg = (rad: number) => rad * 180 / Math.PI

  const φ1 = toRad(lat1)
  const φ2 = toRad(lat2)
  const Δλ = toRad(lng2 - lng1)

  const y = Math.sin(Δλ) * Math.cos(φ2)
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)

  const θ = Math.atan2(y, x)

  return (toDeg(θ) + 360) % 360
}


export function angleCalculator2(
  lng1: number,
  lat1: number,
  lng2: number,
  lat2: number
): number {
  
  const toRad = (deg: number) => deg * Math.PI / 180

  const long1Rad = toRad(lng1)
  const long2Rad = toRad(lng2)

  const lat1Rad = toRad(lat1)
  const lat2Rad = toRad(lat2)

  // Compute the difference in longitudes
  const deltaLon = long1Rad - long2Rad;

  // Calculate the bearing using the formula
  const x = Math.sin(deltaLon) * Math.cos(lat2Rad);
  const y =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLon);
  let bearing = Math.atan2(x, y);

  // Convert bearing from radians to degrees
  bearing = (bearing * 180) / Math.PI;

  // Normalize the bearing to a range of 0 to 360 degrees
  bearing = (bearing + 360) % 360;

  return bearing;
}
