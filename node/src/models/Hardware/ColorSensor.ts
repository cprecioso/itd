import { types } from "mobx-state-tree"

const ColorSensor = types.model("ColorSensor", {
  i: types.number
})

export default ColorSensor
