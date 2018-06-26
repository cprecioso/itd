import DelimiterParser from "@serialport/parser-delimiter"
import { EventEmitter } from "events"
import { Duplex } from "stream"

export type Arg = string | number | boolean
export type Command = [number, Arg[]]

class CmdMessenger extends EventEmitter {
  constructor(protected readonly _serialPort: Duplex) {
    super()
    this._serialPort
      .pipe(new DelimiterParser({ delimiter: ";" }))
      .on("data", data => {
        if (typeof data !== "string") data = data.toString("ascii")
        const [command, ...args] = data.split(",")
        this.emit(`cmd:${command}`, ...args)
      })
  }

  sendCommand(id: number, args?: Arg[]): Promise<void>
  sendCommand(command: Command): Promise<void>
  sendCommand(idOrCommand: number | Command, maybeArgs?: Arg[]): Promise<void> {
    const [id, args] =
      typeof idOrCommand === "number" ? [idOrCommand, maybeArgs] : idOrCommand

    const command =
      [
        "" + id,
        ...(args || []).map(arg => {
          switch (typeof arg) {
            case "string":
              return arg
            case "number":
              return "" + arg
            case "boolean":
              return "" + (arg ? 1 : 0)
            default:
              throw new Error(`Cannot convert ${arg} to string`)
          }
        })
      ].join(",") + ";"

    console.log("Sending", command)

    return new Promise(f => {
      this._serialPort.write(command, "ascii", f)
    })
  }

  createSender(id: number) {
    return (...args: any[]) => this.sendCommand(id, args)
  }
}

export default CmdMessenger
