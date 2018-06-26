import Readline from "@serialport/parser-readline"
import { fromStream } from "most-node-streams"
import SerialPort from "serialport"
import CmdMessenger from "./CmdMessenger"
import * as config from "./config"
import setupGame from "./stream"
import { makeHot } from "./stream/_util"

const serial = new SerialPort(config.serial.port, {
  baudRate: config.serial.baudRate
})

const messenger = new CmdMessenger(serial)

const keypress$ = fromStream(process.stdin.pipe(new Readline({})))
  .map(line => line.trim().toLowerCase())
  .thru(makeHot)

const newGameKeypress$ = keypress$.filter(str => str === "s")

const commandsOut$ = setupGame({
  commands$: messenger.commands$,
  startGame$: newGameKeypress$
})

commandsOut$.forEach(command => messenger.sendCommand(command))
