import { action, autorun, observable } from "mobx"
import socketServer from "./socketServer"
import GameStage from "./stages"

export type Values = [number, number, number, number]

const state = observable({
  stage: GameStage.Idle,
  currentValues: [0, 0, 0, 0] as Values,
  numberOfTokens: 0,
  isPrinting: false,
  startButtonPressed: false,
  pressureButtonPressed: false
})

export default state

export const setStage = action((stage: GameStage) => {
  state.stage = stage
})

autorun(() => socketServer.emit("stage", GameStage[state.stage]))
autorun(() => socketServer.emit("quant", state.currentValues.join(",")))
