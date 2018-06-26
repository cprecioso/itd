import { types } from "mobx-state-tree"
import Led from "../Led"
import ColorSensor from "./ColorSensor"

const HardwarePiece = types.union(ColorSensor, Led)

export default HardwarePiece
