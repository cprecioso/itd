import { ChangeEvent, MouseEvent, PureComponent, SFC } from "react"
import Command from "../Commands"

declare namespace Action {
  interface Props {
    command: Command
    name: string
    onSendEvent: (command: any[]) => void
  }
  interface State {
    loading: boolean
    indicatorFillChain: number
    indicatorFillNum: number
    printPeople: number
    printDate: string
  }
}

class Action extends PureComponent<Action.Props, Action.State> {
  state = {
    loading: false,
    indicatorFillChain: 0,
    indicatorFillNum: 0,
    printPeople: 0,
    printDate: ""
  }

  setActionPromise(prom: Promise<any>) {
    this.setState({ loading: true }, () => {
      prom.then(() => {
        this.setState({ loading: false })
      })
    })
  }

  handleIndicatorFillChain = (evt: ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      indicatorFillChain: parseInt(evt.target.value)
    })
  }
  handleIndicatorFillNum = (evt: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      indicatorFillNum: parseInt(evt.target.value)
    })
  }
  handlePrintPeople = (evt: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      printPeople: parseInt(evt.target.value)
    })
  }
  handlePrintDate = (evt: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      printDate: evt.target.value.slice(0, 19)
    })
  }

  render() {
    const { command, name } = this.props
    const {
      loading,
      indicatorFillChain,
      indicatorFillNum,
      printPeople,
      printDate
    } = this.state
    return (
      <tr>
        <td>
          <span>{name}</span>
        </td>
        {command === Command.ColorIndicatorFill ? (
          <>
            <td>
              <select
                value={indicatorFillChain}
                onChange={this.handleIndicatorFillChain}
              >
                <option value="0">Red</option>
                <option value="1">White</option>
                <option value="2">Green</option>
                <option value="3">Blue</option>
              </select>
            </td>
            <td>
              <input
                type="range"
                min="0"
                max="6"
                step="1"
                value={indicatorFillNum}
                onChange={this.handleIndicatorFillNum}
              />&nbsp;{indicatorFillNum}
            </td>
          </>
        ) : command === Command.PrintStart ? (
          <>
            <td>
              <input
                type="number"
                placeholder="Number of people"
                min="0"
                max="255"
                step="1"
                value={printPeople || ""}
                onChange={this.handlePrintPeople}
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="Today's date"
                maxLength={19}
                value={printDate}
                onChange={this.handlePrintDate}
              />&nbsp;{19 - printDate.length}
            </td>
          </>
        ) : (
          <>
            <td />
            <td />
          </>
        )}
        <td>
          {loading ? (
            <progress />
          ) : (
            <input type="submit" value="Send" onClick={this.handleSubmit} />
          )}
        </td>
      </tr>
    )
  }

  handleSubmit = (evt: MouseEvent<HTMLInputElement>) => {
    evt.preventDefault()
    const { command, onSendEvent } = this.props
    switch (command) {
      case Command.ColorIndicatorFill:
        const { indicatorFillChain, indicatorFillNum } = this.state
        onSendEvent([command, indicatorFillChain, indicatorFillNum])
        break
      case Command.PrintStart:
        const { printPeople, printDate } = this.state
        onSendEvent([command, printPeople, printDate])
        break
      default:
        onSendEvent([command])
    }
  }
}

export { Action }

const ActionSender: SFC<{
  onSendEvent: (command: any[]) => void
}> = ({ onSendEvent }) => {
  return (
    <table>
      <tbody>
        <Action
          onSendEvent={onSendEvent}
          command={Command.ColorIndicatorFill}
          name="Fill color"
        />
        <Action
          onSendEvent={onSendEvent}
          command={Command.PrintStart}
          name="Start printing"
        />
        <Action
          onSendEvent={onSendEvent}
          command={Command.ColorSensorStart}
          name="Start color sensor"
        />
        <Action
          onSendEvent={onSendEvent}
          command={Command.ColorSensorStop}
          name="Stop color sensor"
        />
        <Action
          onSendEvent={onSendEvent}
          command={Command.DisplayStart}
          name="Start display countdown"
        />
        <Action
          onSendEvent={onSendEvent}
          command={Command.ScanLightsStart}
          name="Start scan lights"
        />
      </tbody>
    </table>
  )
}

export default ActionSender
