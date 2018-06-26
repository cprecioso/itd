import { autorun } from "mobx"
import SerialPort from "serialport"
import CmdMessenger from "./CmdMessenger"
import Commands from "./Commands"
import * as config from "./config"
import createPrototype from "./prototype"

const serial = new SerialPort(config.serial.port, {
  baudRate: config.serial.baudRate
})

const messenger = new CmdMessenger(serial)

const prototype = createPrototype()

messenger.once(`cmd:${Commands.Ready}`, () => {
  console.log("Ready")

  let i = 1
  setInterval(() => {
    prototype.colorIndicators[1].set(i)
    i = (i + 1) % 7
  }, 1000)

  autorun(() => {
    messenger.sendCommand(prototype.colorIndicators[1].command)
  })
})
