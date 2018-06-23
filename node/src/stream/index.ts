import { merge, Stream } from "most"
import { proxy, Proxy } from "most-proxy"
import { Command } from "../CmdMessenger"
import createLedStream from "./leds"
import { createMagnetStream } from "./magnets"
import { createPrinterStream } from "./printer"
import createStageLoop from "./stageLoop"
import GameStage from "./stages"
import createGameTimer from "./timer"

export default function setupGame(external: {
  commands$: Stream<Command>
  startGame$: Stream<any>
}) {
  const commands$ = external.commands$.multicast()

  const stageLoop$: Proxy<GameStage> = proxy()

  const gameTimer$ = createGameTimer(stageLoop$.stream)
  const magnetCount$ = createMagnetStream(commands$).multicast()
  const leds$ = createLedStream(stageLoop$.stream, {
    foodQuantity$: magnetCount$,
    timeLeft$: gameTimer$
  })
  const { printCommands$, printDone$ } = createPrinterStream(
    commands$,
    stageLoop$.stream,
    magnetCount$
  )

  stageLoop$.attach(
    createStageLoop(printDone$, { startGame$: external.startGame$ }).multicast()
  )

  const output = merge(leds$, printCommands$)
  return output
}
