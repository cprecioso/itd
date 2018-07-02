import { Stream } from "xstream"
import debounce from "xstream/extra/debounce"
import dropRepeats from "xstream/extra/dropRepeats"
import { makeColorInterpreter, normalizeColor } from "./color"
import socketServer from "./socketServer"

const colors = ["red", "white", "green", "#24388a"]
const getClosest = makeColorInterpreter(colors)

function nullChecker<T>(el: T | undefined): el is T {
  return el != null
}

export default function createColorStream(
  colorCommands$: Stream<[number, number, number, number]>
) {
  const colors$ = colorCommands$.map(normalizeColor)

  colors$.subscribe({
    next(color) {
      process.nextTick(() =>
        socketServer.emit(
          "color",
          color
            .reverse()
            .map((comp, i) => comp * 256 ** i)
            .reduce((acc, curr) => acc + curr, 0)
        )
      )
    }
  })

  const closestColors$ = colors$
    .map(getClosest)
    .filter(nullChecker)
    .compose(debounce(150))
    .compose(dropRepeats())

  closestColors$.subscribe({
    next(colorI) {
      process.nextTick(() => socketServer.emit("colnm", colors[colorI]))
    }
  })

  return closestColors$
}
