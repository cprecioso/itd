import io from "socket.io-client"

const makeSocket = () => io("http://localhost:3001")

export default makeSocket
