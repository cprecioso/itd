import { just, never, periodic, Stream } from "most"
import { fps } from "../config"

export const endless = <A>(a: A) => never().startWith(a) as Stream<A>

export const untilWait = (s: number) => <A>(stream: Stream<A>) =>
  stream.until(just(1).delay(s * 1000 /* s to ms */))

export const createFrameStream = (fps: number) => {
  const ms = 1000 / fps
  return periodic(ms)
    .delay(ms)
    .scan(i => i + 1, 0)
}

export const frameStream$ = createFrameStream(fps).multicast()
