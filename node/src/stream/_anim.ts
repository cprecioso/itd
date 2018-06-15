import { frameStream$ } from "./_util"

export function breathe(wavelength: number) {
  return frameStream$.map(n => {
    const x = 4 * (n / wavelength)
    const y = Math.abs((x % 4) - 2) - 1
    return y
  })
}
