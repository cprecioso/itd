export function mapRange(
  amt: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
) {
  const ratio = (amt - fromMin) / (fromMax - fromMin)
  return ratio * (toMax - toMin) + toMin
}
