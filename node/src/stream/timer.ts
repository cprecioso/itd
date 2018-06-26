import { hold } from "@most/hold"
import { just } from "most"
import { game } from "../config"
import { StageLoop } from "./stageLoop"
import GameStage from "./stages"
import { makeHot, ticker } from "./_util"

export default function createGameTimer(stageLoop$: StageLoop) {
  const timeElapsed$ = stageLoop$
    .map(
      stage =>
        stage === GameStage.Game
          ? ticker(1000).map(n => Math.max(game.time - n, 0))
          : just(0)
    )
    .switchLatest()
    .thru(hold)
    .thru(makeHot)

  return timeElapsed$
}
