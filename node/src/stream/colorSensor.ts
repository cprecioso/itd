import { hold } from "@most/hold"
import { Stream } from "most"
import { Command } from "../CmdMessenger"
import Commands, { CommandNames } from "../Commands"
import { colorValues } from "../config"
import { ColorSensorColor, makeColorInterpreter, normalizeColor } from "./color"
import { StageLoop } from "./stageLoop"
import GameStage from "./stages"
import { makeHot } from "./_util"

const getClosestColor = makeColorInterpreter(colorValues)

export function createColorSensorStream(
  stageLoop$: StageLoop,
  command$: Stream<Command>
) {
  return stageLoop$
    .filter(stage => stage === GameStage.Game)
    .map(() => _createColorSensorStream(command$))
    .switchLatest()
    .thru(hold)
    .thru(makeHot)
}

function _createColorSensorStream(commands$: Stream<Command>) {
  return commands$
    .filter(([id]) => id === CommandNames.ColorSensor)
    .map((command: Command) => {
      const color = Commands.ColorSensor(command).map(n =>
        parseInt(n)
      ) as ColorSensorColor
      const normalizedColor = normalizeColor(color)
      const closestColor = getClosestColor(normalizedColor)
      const value = (closestColor && closestColor.value) || 0
      return value
    })
    .skipRepeats()
    .debounce(100)
}
