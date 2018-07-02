import { SFC } from "react"

declare namespace ColorSensorDisplay {
  interface Props {
    color: number | undefined
  }
}

const ColorSensorDisplay: SFC<ColorSensorDisplay.Props> = ({ color }) => (
  <div>
    <div
      style={{
        backgroundColor: `#${(color && color.toString(16)) || "000000"}`
      }}
    >
      {color ? null : "Nothing"}
    </div>
    <style jsx>{`
      div {
        width: 100px;
        height: 100px;
      }
    `}</style>
  </div>
)

export default ColorSensorDisplay
