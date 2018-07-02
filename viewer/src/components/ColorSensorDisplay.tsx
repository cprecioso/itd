import { SFC } from "react"

declare namespace ColorSensorDisplay {
  interface Props {
    color: number | undefined
    colorName: string | undefined
  }
}

const ColorSensorDisplay: SFC<ColorSensorDisplay.Props> = ({
  color,
  colorName
}) => {
  const displayColor = `#${(color && color.toString(16)) || "FFFFFF"}`
  return (
    <div>
      <div className="colorDisplay" style={{ backgroundColor: displayColor }} />
      <span>{colorName || "Nothing"}</span>
      <style jsx>{`
        .colorDisplay {
          width: 100px;
          height: 100px;
        }
      `}</style>
    </div>
  )
}

export default ColorSensorDisplay
