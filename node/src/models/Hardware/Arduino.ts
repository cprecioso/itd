import { types } from "mobx-state-tree"
import HardwarePiece from "./HardwarePiece"

const Arduino = types.model("Arduino", {
  port: types.string,
  hardware: types.array(HardwarePiece)
})

export default Arduino
