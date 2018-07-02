import ByteLength from "@serialport/parser-byte-length"
import { EventEmitter } from "events"
import { Duplex, PassThrough, pipeline, Readable } from "stream"
import { isArray } from "util"
import Command, { parseCommands } from "./Commands"
import getBuffer, { SerializedCommand } from "./serializer"
import socketServer from "./socketServer"

export class CmdMessenger extends EventEmitter {
  public readonly readSerial: Readable

  constructor(public readonly serial: Duplex) {
    super()
    this.readSerial = pipeline(
      serial as Readable,
      new ByteLength({ length: 1 }),
      new PassThrough()
    )
    this.startEmitting()
  }

  private async startEmitting() {
    for await (const [command, data] of parseCommands(this.readSerial)) {
      this.emit(`cmd:${command}`, data)
      process.nextTick(() =>
        socketServer.emit(
          "rxcmd",
          `RX ${Command[command]} ${data == null ? "" : data}`
        )
      )
    }
  }

  sendCommand(cmd: SerializedCommand) {
    process.nextTick(() =>
      socketServer.emit(
        "rxcmd",
        `TX ${Command[cmd[0][1] as number]} ${cmd
          .slice(1)
          .map(el => (isArray(el) ? el[1] : el.toString("ascii")))}`
      )
    )
    const buf = getBuffer(cmd)
    this.serial.write(buf)
  }
}

export default function createCmdMessenger(serial: Duplex) {
  return new CmdMessenger(serial)
}
