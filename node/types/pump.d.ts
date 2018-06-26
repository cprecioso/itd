declare module "pump" {
  function pump(...streams: (NodeJS.ReadableStream)[]): NodeJS.ReadableStream
  export = pump
}
