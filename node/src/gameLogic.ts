import { format } from "fecha"
import { action, runInAction as ria, when } from "mobx"
import Command, { CommandCreator } from "./Commands"
import state, { setStage } from "./gameState"
import { commands } from "./serial"
import playSound from "./sound"
import GameStage from "./stages"
import { delay } from "./_util"

export async function game() {
  await when(() => state.startButtonPressed === true)
  setInitialState()
  setStage(GameStage.Semaphore)
  // await playSound("../sounds/hello.mp3")
  setStage(GameStage.Game)
  commands.sendCommand(CommandCreator[Command.DisplayStart]())
  commands.sendCommand(CommandCreator[Command.ColorSensorStart]())
  await Promise.all([
    delay(25000).then(() => playSound("../sounds/sirens.mp3")),
    delay(30000).then(() => {
      setStage(GameStage.Processing)
      commands.sendCommand(CommandCreator[Command.ColorSensorStop]())
    })
  ])
  await playSound("../sounds/scan.mp3")
  await when(() => state.pressureButtonPressed === true)
  commands.sendCommand(CommandCreator[Command.ScanLightsStart]())
  ria(() => (state.isPrinting = true))
  commands.sendCommand(
    CommandCreator[Command.PrintStart](
      Math.min(10, state.numberOfTokens),
      format(new Date(), "YYYY-MM-DD HH:MM:SS")
    )
  )
  await when(() => state.isPrinting === false)
  setStage(GameStage.Idle)
}

export const setInitialState = action(() => {
  state.stage = GameStage.Semaphore
  state.currentValues = [0, 0, 0, 0]
  state.numberOfTokens = 0
  // state.isPrinting = false; We don't set it cause we can cause twice printing
  state.startButtonPressed = false
  state.pressureButtonPressed = false
})
