declare module "play-sound" {
  import { ChildProcess, SpawnOptions } from "child_process"

  type AudioPlayer =
    | "mplayer"
    | "afplay"
    | "mpg123"
    | "mpg321"
    | "play"
    | "omxplayer"
    | "aplay"
    | "cmdmp3"

  type Options = Partial<SpawnOptions> & { [P in AudioPlayer]?: string[] }

  class Player {
    play(file: string, cb?: (err?: any) => void): ChildProcess
    play(file: string, opts?: Options, cb?: (err?: any) => void): ChildProcess
  }

  function makePlayer(
    opts?: { players: AudioPlayer[] } | { player: AudioPlayer }
  ): Player

  export = makePlayer
}
