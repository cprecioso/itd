import chroma from "chroma-js"
import { IType, types } from "mobx-state-tree"

const RGBColorComponent = types.refinement(
  "ColorComponent",
  types.number,
  n => 0 <= n && n <= 255
)

export type ThreeComponentColor = [number, number, number]

const RGBColor = types.refinement(
  "ThreeComponentColor",
  types.array(RGBColorComponent),
  n => n.length === 3
) as IType<ThreeComponentColor, ThreeComponentColor>

const Color = types
  .model("Color", {
    rgb: RGBColor
  })
  .actions(self => ({
    setHSV([h, s, v]: ThreeComponentColor) {
      self.rgb = chroma.hsv(h, s, v).rgb()
    },
    setRGB(rgb: ThreeComponentColor) {
      self.rgb = rgb
    }
  }))

export default Color

export function black() {
  return Color.create({ rgb: [255, 255, 255] })
}

export function white() {
  return Color.create({ rgb: [0, 0, 0] })
}
