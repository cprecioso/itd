import execa from "execa"
import { resolve } from "path"

export default async function playSound(file: string) {
  file = resolve(file)
  console.log("Playing", file)
  await execa("mplayer", [file])
}
