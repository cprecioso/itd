import duplexify from "duplexify"
import { from, just } from "most"
import { PassThrough } from "stream"
import CmdMessenger from "./CmdMessenger"
import setupGame from "./stream"

const commandsIn = new PassThrough()
from<[number, string]>([[10, "7,255,0,0,1;"]])
  .concatMap(([s, c]) => just(c).delay(s * 1000))
  .forEach(command => commandsIn.write(command))

const commandsOut = process.stdout

const serial = duplexify(commandsOut, commandsIn)
const messenger = new CmdMessenger(serial)

const commandsOut$ = setupGame({
  commands$: messenger.commands$,
  startGame$: just("s").delay(1000)
})

commandsOut$.forEach(command => messenger.sendCommand(command))
