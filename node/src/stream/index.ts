import { merge, Stream } from "most"
import { proxy, Proxy } from "most-proxy"
import { Command } from "../CmdMessenger"
import { createColorSensorStream } from "./colorSensor"
import createLedStream from "./leds"
import { createPrinterStream } from "./printer"
import createStageLoop from "./stageLoop"
import GameStage from "./stages"
import createGameTimer from "./timer"
import { makeHot } from "./_util"

export default function setupGame(external: {
  commands$: Stream<Command>
  startGame$: Stream<any>
}) {
  const commands$ = external.commands$.thru(makeHot)

  const stageLoopProxy: Proxy<GameStage> = proxy()
  const stageLoop$ = stageLoopProxy.stream.thru(makeHot)

  const timeLeft$ = createGameTimer(stageLoop$)
  const foodQuantity$ = createColorSensorStream(stageLoop$, commands$)

  const leds$ = createLedStream(stageLoop$, {
    foodQuantity$,
    timeLeft$
  })

  const { printCommands$, printDone$ } = createPrinterStream(
    commands$,
    stageLoop$,
    foodQuantity$
  )

  stageLoopProxy.attach(
    createStageLoop(printDone$, { startGame$: external.startGame$ })
  )

  const output = merge(leds$, printCommands$).thru(makeHot)
  return output
}
