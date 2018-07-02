import * as _ from "lodash"
import { Readable } from "stream"
import S2A from "stream-to-async-iterator"
import { arrayTypes as t, TypedNumber } from "./serializer"

type CommandCreator = (...args: any[]) => TypedNumber[]
type CommandReader = (buf: Buffer) => any

enum Command {
  Empty,
  Status,
  Ready,
  ColorIndicatorFill,
  PrintStart,
  PrintDone,
  ColorSensorStart,
  ColorSensorStop,
  ColorSensorData,
  DisplayStart,
  PressureButtonPressed,
  StartButtonPressed,
  ScanLightsStart
}
export default Command

const _CommandCreator = {
  [Command.Empty]: () => [],
  [Command.ColorIndicatorFill]: (chain: number, n: number) =>
    [[t.u8, chain], [t.u8, n]] as TypedNumber[],
  [Command.PrintStart]: (n: number, str: string) =>
    [[t.u8, n], Buffer.from(str, "ascii")] as TypedNumber[],
  [Command.ColorSensorStart]: () => [],
  [Command.ColorSensorStop]: () => [],
  [Command.DisplayStart]: () => [],
  [Command.ScanLightsStart]: () => []
}

export const CommandCreator = _.mapValues(
  _CommandCreator as { [C in Command]?: CommandCreator },
  (fn, cmd) => {
    if (!fn) return
    const commandByte = parseInt(cmd)
    return ((...args: any[]) => [
      [t.u8, commandByte],
      ...fn(...args)
    ]) as CommandCreator
  }
) as typeof _CommandCreator

export const CommandReader: {
  [C in Command]?: { bytes?: number; fn?: CommandReader }
} = {
  [Command.Empty]: {},
  [Command.Ready]: {},
  [Command.PrintDone]: {},
  [Command.ColorSensorData]: {
    bytes: 8,
    fn: (buf: Buffer) => _.times(4, i => buf.readUInt16LE(i * 2))
  },
  [Command.PressureButtonPressed]: { bytes: 0 },
  [Command.StartButtonPressed]: { bytes: 0 }
}

export function readCommandByte(buf: Buffer): Command {
  return buf.readUInt8(0)
}

export async function* parseCommands(
  stream: Readable
): AsyncIterableIterator<[Command, any]> {
  const bytes = new S2A<Buffer | undefined>(stream)
  for await (const firstByte of bytes) {
    if (!firstByte) continue
    const command = readCommandByte(firstByte)
    const commandDef = CommandReader[command]
    if (!commandDef) continue
    if (!commandDef.fn || !commandDef.bytes) {
      yield [command, undefined]
      continue
    }

    const byteArray: Buffer[] = []
    let i = 0
    for await (const byte of bytes) {
      byteArray.push(byte as Buffer)
      if (++i === commandDef.bytes) break
    }
    const buf = Buffer.concat(byteArray)
    yield [command, commandDef.fn(buf)]
    continue
  }
}
