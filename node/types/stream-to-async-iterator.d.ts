declare module "stream-to-async-iterator" {
  import { Readable } from "stream"
  class S2A<T> {
    constructor(stream: Readable)
    [Symbol.asyncIterator]: () => AsyncIterableIterator<T>
  }
  export = S2A
}
