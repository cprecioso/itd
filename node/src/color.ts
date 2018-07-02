import chroma from "chroma-js"
import * as _ from "lodash"

export type Color = [number, number, number]
export type ColorSensorColor = [number, number, number, number]

export function hsvToRGB([h, s, v]: Color): Color {
  return chroma.hsv(h, s, v).rgb()
}

export function makeColorInterpreter<T>(colors: string[]) {
  const colorValues = colors
    .map((color, i) => [color, i] as [string, number | undefined])
    .concat([["black", undefined]])

  return ([r, g, b]: Color) => {
    const inputColor = chroma.rgb(r, g, b)
    const closest = _.sortBy(colorValues, ([color]) =>
      chroma.distance(color, inputColor)
    )[0]
    return closest[1]
  }
}

export function normalizeColor([c, ...rgb]: ColorSensorColor) {
  return _.map(rgb, a => _.clamp(((255 * a) / c) | 0, 0, 255)) as Color
}
