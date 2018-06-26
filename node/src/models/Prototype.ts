import { types } from "mobx-state-tree"
import ColorIndicator from "./ColorIndicator"

const Prototype = types.model({
  colorIndicators: types.array(ColorIndicator)
})

export default Prototype
