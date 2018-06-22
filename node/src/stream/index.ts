import { merge, Stream } from "most"
import { proxy, Proxy } from "most-proxy"
import { Command } from "../CmdMessenger"
import { createColorSensorStream } from "./colorSensor"
import createLedStream from "./leds"
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
    //.tap(console.log.bind(console, "time left"))
    .multicast()

  gameTimer$.drain()

  const magnetCount$ = createColorSensorStream(
    stageLoop$.stream,
    commands$
  ).multicast()

  const leds$ = createLedStream(stageLoop$.stream, {
    foodQuantity$: magnetCount$,
    timeLeft$: gameTimer$
  })
  const printerStreams = createPrinterStream(
    commands$,
    stageLoop$.stream,
    magnetCount$
  )
  const printCommands$ = printerStreams.printCommands$.multicast()
  const printDone$ = printerStreams.printDone$.multicast()

  stageLoop$.attach(
    createStageLoop(printDone$, { startGame$: external.startGame$ }).multicast()
  )

  const output = merge(leds$, printCommands$)
  return output
}
