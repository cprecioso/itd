import fecha from "fecha"
import { Stream } from "most"
import { Command } from "../CmdMessenger"
import Commands, { CommandNames } from "../Commands"
import { StageLoop } from "./stageLoop"
import GameStage from "./stages"
import { makeHot } from "./_util"

export function createPrinterStream(
  commands$: Stream<Command>,
  stageLoop$: StageLoop,
  foodQuantity$: Stream<number>
) {
  const printDone$ = commands$
    .filter(([id]) => id === CommandNames.PrintDone)
    .thru(makeHot)

  const hasToPrint$ = stageLoop$.filter(gs => gs === GameStage.Processing)
  const printCommands$ = foodQuantity$
    .sampleWith(hasToPrint$)
    .map(count =>
      Commands.PrintReceipt(
        fecha.format(new Date(), "YYYY-MM-DD hh:mm:ss"),
        count
      )
    )
    .thru(makeHot)

  return { printDone$, printCommands$ }
}
