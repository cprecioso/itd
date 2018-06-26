import * as _ from "lodash"
import { combine, from, just, merge, Stream } from "most"
import { Command } from "../CmdMessenger"
import Commands from "../Commands"
import { bottomLed, food, game, processingStage, topLed } from "../config"
import { mapRange } from "../_util"
import { Color, hsvToRGB } from "./color"
import { StageLoop } from "./stageLoop"
import GameStage, { StageMap } from "./stages"
import { breatheBetween } from "./_anim"
import { makeHot, makeInt, ticker } from "./_util"

const colorPart = {
  top(hsv: Color) {
    const [r, g, b] = hsvToRGB(hsv)
    return [Commands.LedChain(3, r, g, b)]
  },
  bottom(hsv: Color) {
    const [r, g, b] = hsvToRGB(hsv)
    return _.times(3, i => Commands.LedChain(i, r, g, b))
  }
}

export default function createLedStream(
  stageLoop$: StageLoop,
  external: {
    foodQuantity$: Stream<number>
    timeLeft$: Stream<number>
  }
) {
  external = { ...external, foodQuantity$: external.foodQuantity$ }

  const ledStreams: StageMap<() => Stream<Command[]>> = {
    [GameStage.Semaphore]: () => {
      return ticker(1000)
        .map(n => !!(n % 2))
        .take(6)
        .map(on => [
          on
            ? Commands.LedChainAll(255, 255, 255)
            : Commands.LedChainAll(0, 0, 0)
        ])
    },
    [GameStage.Game]: () => {
      const top = (() => {
        const hue$ = just(topLed.hue)
        const sat$ = just(topLed.sat)

        const val$ = external.timeLeft$
          .map(timeLeft =>
            breatheBetween(
              mapRange(
                timeLeft,
                game.time,
                0,
                topLed.breatheLength[0],
                topLed.breatheLength[1]
              ),
              topLed.val[0],
              topLed.val[1]
            ).map(makeInt)
          )
          .switchLatest()
          .skipRepeats()

        return combine((r, g, b) => colorPart.top([r, g, b]), hue$, sat$, val$)
      })()

      const bottom = (() => {
        const hue$ = external.foodQuantity$.map(n =>
          mapRange(n, 0, food.max, bottomLed.hue[0], bottomLed.hue[1])
        )
        const sat$ = external.foodQuantity$.map(n =>
          mapRange(n, 0, food.max, bottomLed.sat[0], bottomLed.sat[1])
        )
        const val$ = external.timeLeft$
          .map(n =>
            breatheBetween(
              mapRange(
                n,
                game.time,
                0,
                bottomLed.breatheLength[0],
                bottomLed.breatheLength[1]
              ),
              bottomLed.val[0],
              bottomLed.val[1]
            )
          )
          .switchLatest()
          .skipRepeats()

        return combine(
          (r, g, b) => colorPart.bottom([r, g, b]),
          hue$,
          sat$,
          val$
        )
      })()
      return merge(top, bottom)
    },
    [GameStage.Processing]: () => {
      const hue$ = just(processingStage.hue)
      const sat$ = just(processingStage.sat)
      const val$ = breatheBetween(
        processingStage.breatheLength,
        processingStage.val[0],
        processingStage.val[1]
      )

      return combine(
        (h, s, v) => {
          const [r, g, b] = hsvToRGB([h, s, v])
          return [Commands.LedChainAll(r, g, b)]
        },
        hue$,
        sat$,
        val$
      )
    },
    [GameStage.Finished]: () => just([Commands.LedChainAll(0, 255, 0)]),
    [GameStage.Idle]: () => just([Commands.LedChainAll(0, 0, 0)])
  }

  return stageLoop$
    .map(stage => ledStreams[stage]())
    .switchLatest()
    .flatMap(commands => from(commands))
    .thru(makeHot)
}
