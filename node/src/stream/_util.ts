import { just, mergeArray, never, periodic, Stream } from "most"

export const ticker = (ms: number) =>
  periodic(ms)
    .skip(1)
    .scan(i => i + 1, 0)

export const endless = <A>(a: A) => never().startWith(a)

export const untilWait = (s: number) => <A>(in$: Stream<A>) =>
  in$.until(just(1).delay(s * 1000 /* s to ms */))

export const makeHot = <A>(in$: Stream<A>) => {
  const out$ = in$.multicast()
  out$.drain()
  return out$
}

export const makeInt = (n: number) => n | 0

export const race = <T>(...streams: Stream<T>[]) =>
  mergeArray(
    streams.map(stream => stream.take(1).map(v => stream.startWith(v)))
  )
    .take(1)
    .join()

export const raceWith = <A>(in$: Stream<A>) => (...streams: Stream<A>[]) =>
  race(in$, ...streams)

export const timeoutWith = <T>(ms: number, v: T) => (in$: Stream<T>) =>
  race(in$, just(v).delay(ms))
