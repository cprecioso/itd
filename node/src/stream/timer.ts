import { game } from "../config"
import GameStage, { StageLoop } from "./stages"
import { createFrameStream } from "./_util"

export default function createGameTimer(stageLoop$: StageLoop) {
  return stageLoop$
    .filter(stage => stage === GameStage.Game)
    .map(() => _createGameTimer())
    .switchLatest()
}

function _createGameTimer() {
  return createFrameStream(1).map(n => Math.max(game.time - n, 0))
}
