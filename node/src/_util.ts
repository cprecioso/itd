export function mapRange(
  amt: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
) {
  //console.log("mapRange", amt, fromMin, fromMax, toMin, toMax)
  const ratio = (amt - fromMin) / (fromMax - fromMin)
  return ratio * (toMax - toMin) + toMin
}
