declare module "@serialport/parser-byte-length" {
  import { Transform } from "stream"
  class ByteLength extends Transform {
    constructor(options: { length: number })
  }
  export = ByteLength
}
