import SerialPort from "serialport"
import { just } from "../node_modules/most"
import CmdMessenger from "./CmdMessenger"
import * as config from "./config"
import setupGame from "./stream"

const serial = new SerialPort(config.serial.port, {
  baudRate: config.serial.baudRate
})

const messenger = new CmdMessenger(serial)

const commandsOut$ = setupGame({
  commands$: messenger.commands$,
  startGame$: just(1).delay(1000)
})

commandsOut$.forEach(command => messenger.sendCommand(command))
