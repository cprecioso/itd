import io from "socket.io"
import { CommandCreator } from "./Commands"
import { commands } from "./serial"

const socketServer = io()

socketServer.on("connection", socket =>
  socket.on("txcmd", ([cmd, ...args]: any[]) => {
    commands.sendCommand((CommandCreator as any)[cmd](...args))
  })
)

socketServer.listen(3001)

export default socketServer
