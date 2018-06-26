import { easeQuadInOut } from "d3-ease"
import * as _ from "lodash"
import { Stream } from "most"
import { fps } from "../config"
import { makeHot, ticker } from "./_util"

export const frameStream$ = (() => {
  const ms = 1000 / fps
  return ticker(ms).thru(makeHot)
})()

//#region waves

// In the following functions `| 0` is used to force integer division

export const squareWave = _.memoize((period: number) => {
  const framesPerHalfPeriod = ((fps * period) / 2) | 0
  return frameStream$
    .map(n => ((n / framesPerHalfPeriod) | 0) % 2)
    .thru(makeHot)
})

export const sawtoothWave = _.memoize((period: number) => {
  const framesPerPeriod = (fps * period) | 0
  return frameStream$
    .map(n => (n % framesPerPeriod) / framesPerPeriod)
    .thru(makeHot)
})

export const triangularWave = _.memoize((period: number) => {
  const framesPerPeriod = (fps * period) | 0
  const halfFramesPerPeriod = (framesPerPeriod / 2) | 0
  return frameStream$
    .map(
      n =>
        Math.abs((n % framesPerPeriod) - halfFramesPerPeriod) /
        halfFramesPerPeriod
    )
    .thru(makeHot)
})

export const sineWave = _.memoize((period: number) => {
  const framesPerPeriod = (fps * period) | 0
  return frameStream$
    .map(
      n =>
        (Math.sin(((n % framesPerPeriod) / framesPerPeriod) * 2 * Math.PI) +
          1) /
        2
    )
    .thru(makeHot)
})

//#endregion waves

export const smooth = (incrementPerSecond: number) => {
  const incrementPerFrame = incrementPerSecond / fps
  return (in$: Stream<number>) =>
    (in$
      .skipRepeats()
      .sampleWith(frameStream$)
      .scan(
        (current, target) => {
          if (current === target || current === undefined) {
            return target
          } else if (target > current) {
            return Math.min(target, current + incrementPerFrame)
          } else {
            return Math.max(target, current - incrementPerFrame)
          }
        },
        undefined as number | undefined
      )
      .skip(1) as Stream<number>).thru(makeHot)
}

type EasingFn = (t: number) => number
const defaultEase: EasingFn = easeQuadInOut

// export const ease = (duration: number, easingFn = defaultEase) => {
//   const durationInFrames = duration * fps
//   const incrementPerFrame = _.times(
//     durationInFrames + 1,
//     i => i / durationInFrames
//   )

//   return (ins$: Stream<number>) =>
//     ins$
//       .skipRepeats()
//       .scan((prev$, target) => {
//         prev$
//           .take(1)
//           .thru(
//             raceWith<number | undefined>(
//               frameStream$.take(1).constant(undefined)
//             )
//           )
//           .map(curr => {
//             if (curr === target || curr == null) return just(target)
//           })
//         return just(1)
//       }, just(undefined as number | undefined))
//       .thru(makeHot)
// }

export const breatheBetween = (period: number, from: number, to: number) => {
  const diff = to - from
  return sineWave(period)
    .map(n => from + n * diff)
    .thru(makeHot)
}
