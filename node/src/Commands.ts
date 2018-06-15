import fromPairs from "lodash/fromPairs"
import zip from "lodash/zip"
import { Command } from "./CmdMessenger"

function tx(id: number) {
  return (...args: any[]) => [id, args]
}

function rx(id: number): (cmd: Command) => string[]
function rx<Ks extends string>(
  id: number,
  keys: Ks[]
): (cmd: Command) => { [K in Ks]: string }

function rx<Ks extends string>(id: number, keys?: Ks[]) {
  return keys
    ? (cmd: Command) => fromPairs(zip(keys, cmd[1]))
    : (cmd: Command) => cmd[1]
}

export const enum CommandNames {
  Ack,
  Status,
  Ready,
  LedChain,
  LedChainAll,
  PrintReceipt,
  PrintDone,
  Magnet
}

const Commands = {
  Ack: rx(CommandNames.Ack) as (cmd: Command) => [string],
  Status: rx(CommandNames.Status) as (cmd: Command) => [string],
  LedChain: tx(CommandNames.LedChain) as (
    n: number,
    r: number,
    g: number,
    b: number
  ) => Command,
  LedChainAll: tx(CommandNames.LedChainAll) as (
    r: number,
    g: number,
    b: number
  ) => Command,
  PrintReceipt: tx(CommandNames.PrintReceipt) as (
    today: string,
    n: number
  ) => Command,
  PrintDone: rx(CommandNames.PrintDone) as (cmd: Command) => void,
  Magnet: rx(CommandNames.Magnet) as (cmd: Command) => [string]
}

export default Commands
