import { format } from "fecha"
import { Stream } from "most"
import { Command } from "../CmdMessenger"
import Commands, { CommandNames } from "../Commands"
import GameStage, { StageLoop } from "./stages"

export function createPrinterStream(
  commands$: Stream<Command>,
  stageLoop$: StageLoop,
  magnetCount$: Stream<number>
) {
  const printDone$ = commands$.filter(([id]) => id === CommandNames.PrintDone)

  const hasToPrint$ = stageLoop$.filter(gs => gs === GameStage.Processing)
  const printCommands$ = magnetCount$
    .sampleWith(hasToPrint$)
    .map(count =>
      Commands.PrintReceipt(format(new Date(), "YYYY-MM-DD hh:mm:ss"), count)
    )

  return { printDone$, printCommands$ }
}
