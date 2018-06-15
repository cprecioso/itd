declare module "@serialport/parser-delimiter" {
  import { Transform } from "stream"
  class DelimiterParser extends Transform {
    constructor(opts: { delimiter: string | Buffer | string[] })
  }
  export = DelimiterParser
}
