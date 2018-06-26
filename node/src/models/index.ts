import { types } from "mobx-state-tree"
import { LedSet } from "./Led"

const Prototype = types.model("Prototype", {
  ledSets: types.map(LedSet)
})

export default Prototype
