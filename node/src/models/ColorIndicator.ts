import { types } from "mobx-state-tree"
import { Command } from "../CmdMessenger"
import Commands from "../Commands"

const ColorIndicator = types
  .model({
    quantity: types.optional(types.number, 0),
    index: types.number
  })
  .actions(self => ({
    set(n: number) {
      self.quantity = n
    }
  }))
  .views(self => ({
    get command() {
      return [
        Commands.ColorIndicatorSet,
        [self.index, self.quantity]
      ] as Command
    }
  }))

export default ColorIndicator
