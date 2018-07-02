import "@babel/polyfill"
import * as _ from "lodash"
import { action, autorun, runInAction as ria } from "mobx"
import { fromStream, IObservableStream } from "mobx-utils"
import fromEvent from "xstream/extra/fromEvent"
import createColorStream from "./colorStream"
import Command, { CommandCreator } from "./Commands"
import { game } from "./gameLogic"
import state from "./gameState"
import { commands } from "./serial"
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

const colorStream$ = createColorStream(
  fromEvent(commands, `cmd:${Command.ColorSensorData}`)
)

const lastColor = fromStream(colorStream$ as IObservableStream<number>)
autorun(() => {
  if (state.stage == GameStage.Game) {
    const i = lastColor.current
    ria(() => {
      state.currentValues[i]++
      state.numberOfTokens
    })
  }
})

// commands.on(`cmd:${Command.Empty}`, () => {})
// commands.on(`cmd:${Command.Ready}`, () => {})
