import * as _ from "lodash"
import { empty, Stream } from "most"
import { game } from "../config"
import GameStage, { StageLoop, StageMap } from "./stages"
import { endless, untilWait } from "./_util"

export default function createStageLoop(
  printerDone$: Stream<any>,
  external: {
    startGame$: Stream<any>
  }
): StageLoop {
  const stagesStreams: StageMap<($: Stream<GameStage>) => Stream<GameStage>> = {
    [GameStage.Semaphore]: $ => $.thru(untilWait(7)),
    [GameStage.Game]: $ => $.thru(untilWait(game.time)),
    [GameStage.Processing]: $ => $.until(printerDone$),
    [GameStage.Finished]: $ => $.thru(untilWait(5)),
    [GameStage.Idle]: _.identity
  }

  const createStage$ = () =>
    _
      .chain(stagesStreams)
      .mapValues((transformer, stage) =>
        transformer(endless(parseInt(stage) as GameStage))
      )
      .toPairs()
      .sortBy("0")
      .map("1")
      .reduce((prev$, stream$) => prev$.concat(stream$), empty() as Stream<
        GameStage
      >)
      .value()

  const stageLoop$ = external.startGame$
    .map(() => createStage$())
    .switchLatest()
    .startWith(GameStage.Idle)

  return stageLoop$ //.tap(stage => console.log("Stage", GameStage[stage]))
}
