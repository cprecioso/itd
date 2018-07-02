import SerialPort from "serialport"
import createCmdMessenger from "./CmdMessenger"

export const serial = new SerialPort("COM5", { baudRate: 115200 })
export const commands = createCmdMessenger(serial)
