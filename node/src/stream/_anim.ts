import * as _ from "lodash"
import { combine, periodic, Stream } from "most"
import { fps } from "../config"
import { makeHot } from "./_util"

export const frameStream$ = (() => {
  const ms = 1000 / fps
  return periodic(ms)
    .delay(ms)
    .scan(i => i + 1, 0)
    .thru(makeHot)
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
      .combine((target, frame) => target, frameStream$)
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

export const breatheBetween = _.memoize(
  (period: number, from: number, to: number) => {
    const diff = to - from
    return sineWave(period)
      .map(n => from + n * diff)
      .thru(makeHot)
  }
)
