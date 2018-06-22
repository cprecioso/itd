import * as chroma from "chroma-js"
import * as _ from "lodash"
import * as f from "lodash/fp"
import { Stream } from "most"
import { Command } from "../CmdMessenger"
import Commands, { CommandNames } from "../Commands"
import { Color } from "./leds"
import GameStage, { StageLoop } from "./stages"

const getClosestColor = (colorValues => {
  const completeColors = _
    .chain(colorValues)
    .toPairs()
    .map(([color, value]) => ({ color, value }))

  return ([r, g, b]: Color) => {
    const inputColor = chroma.rgb(r, g, b)
    const closest = completeColors
      .sortBy(({ color }) => chroma.distance(color, inputColor))
      .first()
    return closest.value()
  }
})({
  red: 6,
  "#24388a": 3,
  green: 2,
  white: 1,
  black: 0
})

export function createColorSensorStream(
  stageLoop$: StageLoop,
  command$: Stream<Command>
) {
  return stageLoop$
    .filter(stage => stage === GameStage.Game)
    .map(() => _createColorSensorStream(command$))
    .switchLatest()
    .multicast()
}

function _createColorSensorStream(commands$: Stream<Command>) {
  const colors$ = commands$
    .filter(([id]) => id === CommandNames.ColorSensor)
    .map(Commands.ColorSensor)
    .map(f.map(f.toInteger))
    .map(
      ([r, g, b, c]) => [255 * (r / c), 255 * (g / c), 255 * (b / c)] as Color
    )
    .map(getClosestColor)
    .map(f.getOr(0, "value"))
    .skipRepeats()
    .debounce(100)
    .tap(console.log.bind(console, "Value"))
    .multicast()

  colors$.drain()

  return colors$
}
