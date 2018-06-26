import * as _ from "lodash"
import Prototype from "./models/Prototype"

export default () =>
  Prototype.create({
    colorIndicators: _.times(4, index => ({ index }))
  })
