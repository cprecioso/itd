import "@babel/polyfill"
import * as _ from "lodash"
import { action, autorun, runInAction as ria } from "mobx"
import { ColorSensorColor, makeColorInterpreter, normalizeColor } from "./color"
import Command, { CommandCreator } from "./Commands"
import { game } from "./gameLogic"
import state from "./gameState"
import { commands } from "./serial"
import socketServer from "./socketServer"
import GameStage from "./stages"

autorun(() =>
  state.currentValues.forEach((n, i) =>
    commands.sendCommand(
      CommandCreator[Command.ColorIndicatorFill](i, _.clamp(n, 0, 6))
    )
  )
)

void (async () => {
  while (true) {
    try {
      await game()
    } catch (err) {
      console.log("Error!")
      console.log(err)
    }
  }
})()

commands.on(`cmd:${Command.StartButtonPressed}`, () => {
  ria(() => (state.startButtonPressed = true))
  setTimeout(action(() => (state.startButtonPressed = false)), 10)
})

commands.on(`cmd:${Command.PressureButtonPressed}`, () => {
  ria(() => (state.pressureButtonPressed = true))
  setTimeout(action(() => (state.pressureButtonPressed = false)), 10)
})

commands.on(
  `cmd:${Command.PrintDone}`,
  action(() => (state.isPrinting = false))
)

const getClosest = makeColorInterpreter(["red", "white", "green", "#24388a"])
commands.on(
  `cmd:${Command.ColorSensorData}`,
  action((data: ColorSensorColor) => {
    const color = normalizeColor(data)

    if (state.stage == GameStage.Game) {
      const i = getClosest(color)
      if (i != null) {
        state.currentValues[i]++
        state.numberOfTokens++
      }
    }

    process.nextTick(() =>
      socketServer.emit(
        "color",
        color
          .reverse()
          .map((comp, i) => comp * 256 ** i)
          .reduce((acc, curr) => acc + curr, 0)
      )
    )
  })
)

commands.on(`cmd:${Command.Empty}`, () => {})
commands.on(`cmd:${Command.Ready}`, () => {})
