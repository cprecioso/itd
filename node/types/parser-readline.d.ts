declare module "@serialport/parser-readline" {
  import { Transform } from "stream"
  class ReadlineParser extends Transform {
    constructor(opts: {
      delimiter?: string | Buffer | string[]
      encoding?: string
    })
  }
  export = ReadlineParser
}
