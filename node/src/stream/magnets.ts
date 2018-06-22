import * as _ from "lodash"
import { combineArray, Stream } from "most"
import { Command } from "../CmdMessenger"
import { CommandNames } from "../Commands"
import GameStage, { StageLoop } from "./stages"

export function createMagnetStream(
  stageLoop$: StageLoop,
  command$: Stream<Command>
) {
  return stageLoop$
    .filter(stage => stage === GameStage.Game)
    .map(() => _createMagnetStream(command$))
    .switchLatest()
}

function _createMagnetStream(commands$: Stream<Command>) {
  const bitmask$ = commands$
    .filter(([id]) => id === CommandNames.Magnet)
    .map(
      ([id, [data]]) =>
        _.padStart(parseInt("" + data, 10).toString(2), 8, "0").split("") as (
          | "0"
          | "1")[]
    )
    .multicast()

  const magnetCount$s = _.times(8, i =>
    bitmask$
      .map(bitmask => bitmask[i])
      .skipRepeats()
      .debounce(200)
      .skipRepeats()
      .scan((count, bit) => (bit === "1" ? count + 1 : count), 0)
      .skipRepeats()
  )

  const magnetCount$ = combineArray(
    (...counts) => counts.reduce((total, count) => total + count, 0),
    magnetCount$s
  ).tap(console.log.bind(console, "Magnet count"))

  return magnetCount$
}
