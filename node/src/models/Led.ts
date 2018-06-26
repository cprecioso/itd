import { types } from "mobx-state-tree"
import Color, { black } from "./Color"

const Led = types.model("Led", {
  i: types.number,
  color: types.optional(Color, black)
})

export default Led

const LedSet = types.model("LedSet", {
  leds: types.array(Led)
})

export { LedSet }
