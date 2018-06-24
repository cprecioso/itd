import { just, never, Stream } from "most"

export const endless = <A>(a: A) => never().startWith(a)

export const untilWait = (s: number) => <A>(in$: Stream<A>) =>
  in$.until(just(1).delay(s * 1000 /* s to ms */))

export const makeHot = <A>(in$: Stream<A>) => {
  const out$ = in$.multicast()
  out$.drain()
  return out$
}

export const makeInt = (n: number) => n | 0
