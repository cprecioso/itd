import chroma from "chroma-js"
import * as _ from "lodash"

export type Color = [number, number, number]
export type ColorSensorColor = [number, number, number, number]

export function hsvToRGB([h, s, v]: Color): Color {
  return chroma.hsv(h, s, v).rgb()
}

export function makeColorInterpreter<T>(colorValues: { [color: string]: T }) {
  const completeColors = _
    .chain(colorValues)
    .toPairs()
    .map(([color, value]) => ({ color, value }))

  return ([r, g, b]: Color) => {
    const inputColor = chroma.rgb(r, g, b)
    const closest = completeColors
      .sortBy(({ color }) => chroma.distance(color, inputColor))
      .first()
    return closest.value()
  }
}

export function normalizeColor([c, ...rgb]: ColorSensorColor) {
  return _.map(rgb, a => (255 * a) / c) as Color
}
