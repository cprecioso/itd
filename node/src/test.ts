import SerialPort from "serialport"
import CmdMessenger from "./CmdMessenger"
import * as config from "./config"

const serial = new SerialPort(config.serial.port, {
  baudRate: config.serial.baudRate
})
const messenger = new CmdMessenger(serial)

messenger.commands$
  //.filter(([id]) => id !== 7)
  .forEach(([id, ...args]) => {
    console.log("Received", id, ...args)
  })
  .catch(console.log.bind(console, "Error"))

const c = () => Math.round(Math.random() * 255)

// void (async () => {
//   await messenger.commands$
//     .filter(([id]) => id === CommandNames.Ready)
//     .take(1)
//     .drain()

//   await most
//     .periodic(1000)
//     .delay(1000)
//     .scan(n => n + 1, 0)
//     .map(n => n % 4)
//     .take(10)
//     .forEach(led => {
//       messenger.sendCommand(Commands.LedChain(led, c(), c(), c()))
//     })

//   messenger.sendCommand(Commands.PrintReceipt("{TODAYDATE}", 2))
// })()
