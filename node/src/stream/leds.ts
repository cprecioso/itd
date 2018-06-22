import * as _ from "lodash"
import { combine, from, just, Stream } from "most"
import tc from "tinycolor2"
import { Command } from "../CmdMessenger"
import Commands from "../Commands"
import { bottomLed, food, game } from "../config"
import { mapRange } from "../_util"
import GameStage, { StageLoop, StageMap } from "./stages"
import { createFrameStream } from "./_util"

type Color = [number, number, number]

function hsvToRGB([h, s, v]: Color): Color {
  const { r, g, b } = tc({ h, s, v }).toRgb()
  return [r, g, b]
}

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
  external = { ...external, foodQuantity$: external.foodQuantity$.multicast() }

  const ledStreams: StageMap<() => Stream<Command[]>> = {
    [GameStage.Semaphore]: () => {
      return createFrameStream(1).map(n => [
        !!(n % 2)
          ? Commands.LedChainAll(255, 255, 255)
          : Commands.LedChainAll(0, 0, 0)
      ])
    },
    [GameStage.Game]: () => {
      const bottom = (() => {
        const hue$ = external.foodQuantity$.map(n =>
          mapRange(n, 0, food.max, bottomLed.hue[0], bottomLed.hue[1])
        )
        const sat$ = external.foodQuantity$.map(n =>
          mapRange(n, 0, food.max, bottomLed.sat[0], bottomLed.sat[1])
        )
        const val$ = external.timeLeft$.map(n =>
          mapRange(n, game.time, 0, bottomLed.val[0], bottomLed.val[1])
        )

        return combine(
          (h, s, v) => colorPart.bottom([h, s, v]),
          hue$,
          sat$,
          val$
        )
      })()
      return bottom.tap(console.log.bind(console, "Game lights!"))
    },
    [GameStage.Processing]: () => {
      const [r, g, b] = hsvToRGB([234, 100, 100])
      return just([Commands.LedChainAll(r, g, b)])

      const hue$ = just(234)
      const sat$ = just(100)
      const val$ = just(100)
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
    .tap(console.log.bind(console, "Going in"))
    .map(stage => ledStreams[stage]())
    .tap(console.log.bind(console, "Going out"))
    .switchLatest()
    .flatMap(arr => from(arr))
}
