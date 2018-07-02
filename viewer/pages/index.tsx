import { PureComponent } from "react";
import ActionSender from "../src/components/ActionSender";
import ColorSensorDisplay from "../src/components/ColorSensorDisplay";
import CommandDisplayer from "../src/components/CommandDisplayer";
import QuantityDisplay from "../src/components/QuantityDisplay";
import makeSocket from "../src/socket";

declare namespace App {
  interface Props {}
  interface State {
    socket?: SocketIOClient.Socket
    stage?: string
    color?: number
    quant?: [number, number, number, number]
    last10Commands: string[]
  }
}

class App extends PureComponent<App.Props, App.State> {
  state = { last10Commands: [] } as App.State

  componentDidMount() {
    const socket = makeSocket()

    socket.on("stage", (stage: string) => this.setState({ stage }))
    socket.on("color", (color: number) => this.setState({ color }))
    socket.on("quant", (quant: string) =>
      this.setState({
        quant: quant.split(",").map(n => parseInt(n, 10)) as [
          number,
          number,
          number,
          number
        ]
      })
    )
    socket.on("rxcmd", (command: string) =>
      this.setState(({ last10Commands }) => ({
        last10Commands: [command, ...last10Commands.slice(0, 9)]
      }))
    )

    this.setState({ socket })
  }

  handleSendCommand = (cmd: any[]) => {
    this.state.socket && this.state.socket.emit("txcmd", cmd)
  }

  render() {
    const { stage, color, quant, last10Commands } = this.state
    return (
      <div className="main">
        <div className="stage">
          <h4>Game stage:</h4>
          <h1>{stage || ""}</h1>
        </div>
        <ColorSensorDisplay color={color} />
        <QuantityDisplay n={quant || [0, 0, 0, 0]} />
        <ActionSender onSendEvent={this.handleSendCommand} />
        <CommandDisplayer commands={last10Commands} />
        <style jsx>{`
          :global(body) {
            background: white;
            color: black;
          }
          .main {
            display: flex;
            flex-flow: row wrap;
          }
          .main > :global(*) {
            border: 3px solid black;
            margin: 1em;
            padding: 1em;
          }
          .stage {
            width: 80vw;
          }
        `}</style>
      </div>
    )
  }
}

export default App
